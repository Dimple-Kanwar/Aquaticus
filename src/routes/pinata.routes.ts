import { Router } from 'express';
import { uploadFile, getFile, getUserFiles } from '../controllers/pinata.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: '/tmp' });

router.post('/upload', upload.single('file'), uploadFile);
router.get('/file/:ipfsHash', getFile);
router.get('/files/:userId', getUserFiles);

export default router;