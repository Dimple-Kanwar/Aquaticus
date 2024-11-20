import { Router } from 'express';
import {createNFT,getAllNFTs,getNFT, getNFTMetadata} from '../controllers/nft.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: '/tmp' });

router.post('/mint',  upload.single('file'), createNFT);
router.get('/info/:tokenId', getNFT);
router.get('/:userAddress', getAllNFTs);
router.get('/nft/:metadataHash', getNFTMetadata);

export default router;