import { Router } from 'express';
import {createNFT,getAllNftsByOwner,getNFT, getNFTMetadata} from '../controllers/nft.controller';
import { validateMintNFT } from '../middleware/validation.middleware';
import { validateNFTFile } from '../middleware/file-upload.middleware';

const router = Router();

router.post(
    '/mint',  
    validateNFTFile, // File upload middleware
    validateMintNFT,  // DTO validation middleware
    createNFT
);
router.get('/info/:tokenId', getNFT);
router.get('/:ownerAddress', getAllNftsByOwner);
router.get('/nft/:metadataHash', getNFTMetadata);

export default router;