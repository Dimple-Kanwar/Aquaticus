import { Router } from 'express';
import {createNFT,getAllNftsByOwner,getNFT, getNFTMetadata, transferNFT} from '../controllers/nft.controller';
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
router.get('/asset/:metadataHash', getNFTMetadata);
router.put('/transfer', transferNFT)

export default router;