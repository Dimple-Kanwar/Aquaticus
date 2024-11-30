import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure multer upload
export const upload = multer({ dest: '/tmp' });

// Custom file validation middleware
export const validateNFTFile = (req: Request, res: Response, next: NextFunction) => {
    upload.single('nftFile')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer error (file size, etc.)
            return res.status(400).json({
                message: 'File upload error',
                error: err.message
            });
        } else if (err) {
            // Custom validation error
            return res.status(400).json({
                message: 'File validation failed',
                error: err.message
            });
        }
        // No file uploaded, throw error
        if (!req.file) {
            return res.status(400).json({
                message: 'No File uploaded',
                error: err.message
            });
        }
        return next();
    });
};
