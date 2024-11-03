import {mintNFT,viewNFT } from '../services/nft.service';
import { Request, Response } from 'express';


const createNFT = async (req: Request, res: Response) => {
    const { tokenId, metadata, userAddress } = req.body;
    const result = await mintNFT(tokenId, userAddress, metadata);
    res.status(201).json(result);
}

const getNFT = async (req: Request, res: Response) => {
    const { tokenId } = req.params;
    const nft = await viewNFT();
    res.json(nft);
}

export default {
    createNFT,
    getNFT
};
