import { Router } from 'express';
import { uploadFile, getFile, getUserFiles } from '../controllers/pinata.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: '/tmp' });

/**
 * Pinata Routes
 * @swagger
 * /api/pinata/upload:
 *   post:
 *     summary: Upload file to Pinata
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: { type: string, format: binary }
 */
router.post('/upload', upload.single('file'), uploadFile);

/**
 * @swagger
 * /api/pinata/file/{ipfsHash}:
 *   get:
 *     summary: Get file from Pinata by IPFS hash
 *     parameters:
 *       - in: path
 *         name: ipfsHash
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/file/:ipfsHash', getFile);

/**
 * @swagger
 * /api/pinata/user/{userId}/files:
 *   get:
 *     summary: Get all files for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/user/:userId/files', getUserFiles);

export default router;