import { Router } from 'express';
import nftController from '../controllers/nft.controller';

const router = Router();

router.post('/mint', nftController.createNFT);
router.get('/info/:tokenId', nftController.getNFT);

export default router;