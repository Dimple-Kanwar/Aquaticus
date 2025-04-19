import {
  _burnNFT,
  _transferNFT,
  getNFTById,
  getNftsByOwner,
  mintNFT,
} from "../services/nft.service";
import { Request, Response } from "express";
import { fetchFile } from "../services/pinata.service";
import { MintNFTDto } from "../dto/mint-nft.dto";
import { handleControllerError, NFTError } from "../utils/nft.error";
import { ethers } from "ethers";

// Mint an NFT
export const createNFT = async (req: Request, res: Response) => {
  try {
    // Validate request
    const nftFile: any = req.file!;
    const mintDto: MintNFTDto = req.body;

    if (!nftFile) {
      throw new NFTError("Missing required NFT file", 400);
    }
    if (!req.body.metadata) {
      throw new NFTError("Missing metadata", 400);
    }
    if (!req.body.recipient) throw new NFTError("Missing recipient", 400);
    else if (!ethers.isAddress(req.body.recipient)) {
      throw new NFTError("Invalid Ethereum address", 400);
    }
    console.log("createNFT");
    const result = await mintNFT(mintDto, nftFile);
    console.log({ result });
    res.status(201).json({
      success: true,
      message: "NFT Minted Successfully",
      data: result,
    });
    return;
  } catch (error) {
    return handleControllerError(error, res, "Minting NFT failed");
  }
};

// Get NFT Metadata by metadata hash
export const getNFTMetadata = async (req: Request, res: Response) => {
  try {
    const { metadataHash } = req.params;
    if (!metadataHash) {
      throw new NFTError("Metadata hash is required", 400);
    }
    const tokenURI = `${process.env.PINATA_DOMAIN}${metadataHash}`;
    const result = await fetchFile(tokenURI);
    if (!result) {
      throw new NFTError("NFT metadata not found", 404);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
    return;
  } catch (error) {
    return handleControllerError(error, res, "Failed to fetch NFT metadata");
  }
};

// Get NFT by Id
export const getNFT = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    console.log({ tokenId });
    const result = await getNFTById(Number(tokenId));
    if (!result) {
      console.log({ result });
      throw new NFTError("NFT not found", 404);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
    return;
  } catch (error: any) {
    console.log({ error });
    return handleControllerError(error, res, "Failed to fetch NFT");
  }
};

// Get NFTs by owner address
export const getAllNftsByOwner = async (req: Request, res: Response) => {
  try {
    const { ownerAddress } = req.params;

    // Validate Ethereum address format
    if (!ownerAddress || !ethers.isAddress(ownerAddress)) {
      throw new NFTError("Invalid Ethereum address format", 400);
    }

    const nfts = await getNftsByOwner(ownerAddress);

    // // Handle empty result case
    // if (nfts.length === 0) {
    //    res.status(404).json({
    //     message: "No NFTs found for this owner",
    //   });
    //   return;
    // }

    res.status(200).json({
      total: nfts.length,
      nfts,
    });
    return;
  } catch (error: any) {
    console.error("Error fetching NFTs by owner:", error);

    // Handle specific error types if needed
    return handleControllerError(error, res, "Failed to fetch NFTs by owner");
  }
};

// Transfer NFT
export const transferNFT = async (req: Request, res: Response) => {
  try {
    const { from, to, tokenId } = req.body;
    // Validate addresses and token ID
    if (!from || !to || !tokenId) {
      throw new NFTError("Missing required parameters", 400);
    }
    if (!ethers.isAddress(from) || !ethers.isAddress(to)) {
      throw new NFTError("Invalid Ethereum address format", 400);
    }
    const hash = await _transferNFT(from, to, tokenId);
    res.status(200).json({
      success: true,
      message: "NFT transferred successfully!",
      data: { transactionHash: hash },
    });
    return;
  } catch (error) {
    return handleControllerError(error, res, "NFT transfer failed");
  }
};

// Burn NFT
export const burnNFT = async (req: Request, res: Response) => {
  const { tokenId: tokenIdParam } = req.params;
  const { ownerAddress } = req.body;
  try {
    // Validate token ID format
    const tokenId = Number(tokenIdParam);
    if (!Number.isInteger(tokenId) || tokenId <= 0) {
      res.status(400).json({ error: "Invalid token ID format" });
      return;
    }
    // Validate Ethereum address format
    if (!ethers.isAddress(ownerAddress)) {
      res.status(400).json({ error: "Invalid Ethereum address format" });
      return;
    }

    const result = await _burnNFT(Number(tokenId), ownerAddress);
    res.status(200).json({ message: "NFT burned successfully", result });
    return;
  } catch (error) {
    handleControllerError(error, res, "NFT burn failed");
  }
};

// Update NFT
