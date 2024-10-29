const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const { apiLimiter } = require('../middleware/rateLimiter.middleware');
const nftController = require('../controllers/nft.controller');

router.post('/mint', authenticateToken, apiLimiter, nftController.mintNFT);
router.post('/:tokenId/transfer', authenticateToken, apiLimiter, nftController.transferNFT);
router.patch('/:tokenId/stats', authenticateToken, apiLimiter, nftController.updateNFTStats);

module.exports = router;