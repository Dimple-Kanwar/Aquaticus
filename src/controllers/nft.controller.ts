import { validationResult } from "express-validator";
import {
  _transferNFT,
  getNFTById,
  getNftsByOwner,
  mintNFT,
  _burnNFT,
} from "../services/nft.service";
import { Request, Response } from "express";
import { fetchFile } from "../services/pinata.service";
import { MintNFTDto } from "../dto/mint-nft.dto";
import { ethers } from "ethers";

// Mint an NFT
export const createNFT = async (req: Request, res: Response) => {
  try {
    console.log("createNFT");
    const mintDto: MintNFTDto = req.body;
    const files: any = req.files;
    const nftFile = files.nftFile[0];
    const metadataFile = files.metadataFile[0];
    const result = await mintNFT(mintDto, nftFile, metadataFile);
    console.log({ result });
    res.status(201).json({
      message: "NFT Minted Successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Minting NFT failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get NFT Metadata by metadata hash
export const getNFTMetadata = async (req: Request, res: Response) => {
  try {
    console.log({ metadataHash: req.params });
    const tokenURI = `${process.env.PINATA_DOMAIN}${req.params.metadataHash}`;
    const result = await fetchFile(tokenURI);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: "NFT metadata not found" });
  }
};

// Get NFT by Id
export const getNFT = async (req: Request, res: Response) => {
  try {
    const tokenId = Number(req.params.tokenId);

    // Validate tokenId is a number
    if (isNaN(tokenId)) {
      res.status(400).json({ error: "Invalid token ID format" });
      return;
    }

    const result = await getNFTById(tokenId);
    // Handle not found case
    if (!result) {
      res.status(404).json({ error: "NFT not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    // Differentiate between expected and unexpected errors
    if (error instanceof Error) {
      console.error("NFT Not Found: ", error);
      res.status(404).json({ error: error.message });
      return;
    }

    // Log unexpected errors (recommended for debugging)
    console.error("Failed to retrieve NFT:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get NFTs by owner address
export const getAllNftsByOwner = async (req: Request, res: Response) => {
  try {
    const { ownerAddress } = req.params;

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(ownerAddress)) {
      res.status(400).json({
        message: "Invalid Ethereum address format",
      });
      return;
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
  } catch (error: any) {
    console.error("Error fetching NFTs by owner:", error);

    // Handle specific error types if needed
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message || "Internal server error",
    });
  }
};

// Transfer NFT
export const transferNFT = async (req: Request, res: Response) => {
  try {
    const { from, to, tokenId } = req.body;
    const hash = await _transferNFT(from, to, tokenId);
    console.log({ hash });
    res.status(200).json({
      transactionHash: hash,
      message: "NFT transferred successfully!",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: `NFT transfer Error: ${error.message}`,
      });
    }
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
       res.status(400).json({ error: 'Invalid Ethereum address format' });
       return;
    }

    const result = await _burnNFT(Number(tokenId), ownerAddress);
    res.status(200).json({ message: "NFT burned successfully", result });
  } catch (error) {
    res.status(500).json({
      message: "Burning NFT failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update NFT
