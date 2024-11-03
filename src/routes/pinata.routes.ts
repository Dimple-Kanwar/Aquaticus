import { Router } from 'express';
import { uploadFile } from '../controllers/pinata.controller';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: '/tmp' });

router.post('/upload', upload.single('file'), uploadFile);

export default router;