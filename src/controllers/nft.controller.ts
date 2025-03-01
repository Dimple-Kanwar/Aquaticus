import { validationResult } from 'express-validator';
import { _transferNFT, getNFTById, getNftsByOwner, mintNFT, _burnNFT } from '../services/nft.service';
import { Request, Response } from 'express';
import { fetchFile } from '../services/pinata.service';
import { MintNFTDto } from '../dto/mint-nft.dto';


// Mint an NFT
export const createNFT = async (req: Request, res: Response) => {
  try {
    console.log("createNFT")
    const mintDto: MintNFTDto = req.body;
    const files: any = req.files;
    const nftFile = files.nftFile[0]
    const metadataFile = files.metadataFile[0];
    const result = await mintNFT(mintDto, nftFile, metadataFile);
    console.log({ result });
    res.status(201).json({
      message: 'NFT Minted Successfully',
      result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Minting NFT failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

}

// Get NFT Metadata by metadata hash
export const getNFTMetadata = async (req: Request, res: Response) => {
  try {
    console.log({ metadataHash: req.params });
    const tokenURI = `${process.env.PINATA_DOMAIN}${req.params.metadataHash}`;
    const result = await fetchFile(tokenURI);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: 'NFT metadata not found' });
  }
}

// Get NFT by Id
export const getNFT = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    console.log({ tokenId });
    const result = await getNFTById(Number(tokenId));
    res.json(result);
  } catch (error) {
    res.status(404).json({ error });
  }
}

// Get NFTs by owner address
export const getAllNftsByOwner = async (req: Request, res: Response) => {
  try {
    const { ownerAddress } = req.params;
    // Additional validation if needed
    if (!ownerAddress) {
      throw new Error('Owner address is required');
    }
    // Basic address validation
    if (!ownerAddress || !/^0x[a-fA-F0-9]{40}$/.test(ownerAddress)) {
      res.status(400).json({
        message: 'Invalid Ethereum address format'
      });
    }

    const nfts = await getNftsByOwner(ownerAddress);

    // Handle case when no NFTs found
    if (nfts.length === 0) {
      res.status(404).json({
        message: 'No NFTs found for this owner'
      });
    }

    res.status(200).json({
      total: nfts.length,
      nfts: nfts
    });
  } catch (error) {
    console.error('Error fetching NFTs by owner:', error);
    res.status(500).json({
      message: 'Internal server error'
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
      message: "NFT transferred successfully!"
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: `NFT transfer Error: ${error.message}`
      });
    }

  }

}

// Burn NFT
export const burnNFT = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    // Call the smart contract's burnNFT function here
    // Assuming you have a service function to interact with the contract
    const result = await _burnNFT(Number(tokenId));
    res.status(200).json({ message: 'NFT burned successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Burning NFT failed', error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

// Update NFT