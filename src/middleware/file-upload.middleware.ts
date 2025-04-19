import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {

    // Accept images and json files
    if (file.fieldname === 'nftFile') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file types! Only images are allowed in nftFile field."));
        }
    } else if (file.fieldname === 'metadataFile') {
        if (file.mimetype === 'application/json') {
            cb(null, true);
        } else {
            cb(new Error("Invalid file types! Only json file are allowed in metadataFile field."));
        }
    }
}

// Configure multer upload
export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter
});

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
                error: "NFT file is required"
            });
        }
        return next();
    });
};
