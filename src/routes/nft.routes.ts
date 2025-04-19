import { Router } from 'express';
import { burnNFT, createNFT, getAllNftsByOwner, getNFT, getNFTMetadata, transferNFT } from '../controllers/nft.controller';
import { validateMintNFT, validateRequest } from '../middleware/validation.middleware';
import { upload, validateNFTFile } from '../middleware/file-upload.middleware';
import { body, param } from 'express-validator';

const router = Router();

/**
 * NFT Routes
 * @swagger
 * /api/asset/mint:
 *   post:
 *     summary: Create a new NFT
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               nftFile: { type: string, format: binary }
 *               metadataFile: { type: string, format: binary }
 */
// router.post(
//     '/mint',
//     upload.single(
//         { name: 'nftFile', maxCount: 1 },
//     ), // File upload middleware
//     validateRequest,  // DTO validation middleware
//     createNFT
// );
router.post(
    '/mint',  
    validateNFTFile, // File upload middleware
    validateMintNFT,  // DTO validation middleware
    createNFT
);

/**
 * @swagger
 * /api/asset/{tokenId}:
 *   get:
 *     summary: Get NFT by token ID
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: number
 */
router.get(
    '/info/:tokenId',
    [
        param('tokenId').isInt().toInt().withMessage("Invalid token Id"),
        param('tokenId').exists().withMessage("tokenId is missing"),
        validateRequest
    ],
    getNFT
);

/**
 * @swagger
 * /api/asset/{ownerAddress}:
 *   get:
 *     summary: Get all NFTs by owner address
 *     parameters:
 *       - in: path
 *         name: ownerAddress
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:ownerAddress', getAllNftsByOwner);

/**
 * @swagger
 * /api/asset/metadata/{metadataHash}:
 *   get:
 *     summary: Get NFT metadata by hash
 *     parameters:
 *       - in: path
 *         name: metadataHash
 *         required: true
 *         schema:
 *           type: string
 */
router.get(
    '/metadata/:metadataHash',
    [
        param('metadataHash').isString().notEmpty(),
        validateRequest
    ],
    getNFTMetadata
);

/**
 * @swagger
 * /api/asset/transfer:
 *   post:
 *     summary: Transfer NFT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               from: { type: string }
 *               to: { type: string }
 *               tokenId: { type: number }
 */
router.put(
    '/transfer',
    [
        body('from').matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid from address'),
        body('to').matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid to address'),
        body('tokenId').exists().withMessage("tokenId is missing"),
        body('tokenId').isInt().toInt().withMessage("Invalid token Id. Expected Numeric value"),
        validateRequest
    ],
    transferNFT
)

/**
 * @swagger
 * /api/asset/burn/{tokenId}:
 *   post:
 *     summary: Burn NFT
 *     parameters:
 *       - in: path
 *         name: tokenId
 *         required: true
 *         schema:
 *           type: number
 *      - in: body
 *        name: ownerAddress
 *        required: true
 *        schema:
 *          type: string      
 */
router.post('/burn/:tokenId', burnNFT)

export default router;