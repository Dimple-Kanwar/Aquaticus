import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    
    // Accept images and json files
    if (file.fieldname === 'nftFile') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file types! Only images are allowed in nftFile field."));
        }
    }else if (file.fieldname === 'metadataFile') {
        if (file.mimetype === 'application/json') {
            cb(null, true);
        } else {
            cb(new Error("Invalid file types! Only json file are allowed in metadataFile field."));
        }
    }
}

// Configure multer upload
export const upload = multer({
    dest: '/tmp', 
    limits: {
        fileSize: 1000000 // 1MB
    }, 
    fileFilter: fileFilter
});

// Custom file validation middleware
export const validateNFTFile = (req: Request, res: Response, next: NextFunction) => {
    upload.fields([{ name: "nftFile", maxCount: 1}, { name: "metadataFile", maxCount: 1}])(req, res, (err) => {
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
        const files: any = req.files;
        // No file uploaded, throw error
        if (!files || !files.nftFile || !files.metadataFile) {
            return res.status(400).json({
                message: 'Both NFT and metadata files are required',
                // error: err.message
            });
        }
        return next();
    });
};
