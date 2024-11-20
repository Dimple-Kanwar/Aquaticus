import { validationResult } from 'express-validator';
import { listNFTByUser, mintNFT, viewNFT } from '../services/nft.service';
import { Request, Response } from 'express';
import { getNFTMetadataFromPinata } from '../services/pinata.service';


export const createNFT = async (req: Request, res: Response) => {
    console.log("createNFT")
    if (!req.file) {
        res.status(400).json({ error: 'No image file provided' });
    }
    const file = req.file!;
    const result = await mintNFT(req.body, file);
 
    res.status(201).json(result);
}

export const getNFT = async (req: Request, res: Response) => {
    const { tokenId } = req.params;
    const nft = await viewNFT();
    res.json(nft);
}

export const getNFTMetadata = async (req: Request, res: Response) => {
    try {
        console.log({metadataHash: req.params});
        const result = await getNFTMetadataFromPinata(req.params.metadataHash);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: 'NFT metadata not found' });
    }
}

export const getAllNFTs = async (req: Request, res: Response) => {
    const userAddress = req.params.userAddress;
    const nfts = await listNFTByUser(userAddress);
    res.json(nfts);
}