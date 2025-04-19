import { Request, Response } from "express";

export class PinataError extends Error {
    constructor(
        message: string,
        public code: number = 500,
        public data?: any
    ) {
        super(message);
        this.name = 'PinataError';
    }
}

// Centralized error handler
export const handlePinataError = (error: any, res: Response, defaultMessage: string) => {
    console.error('Pinata Controller Error:', error);

    if (error instanceof PinataError) {
        res.status(error.code).json({
            success: false,
            message: error.message,
            data: error.data
        });
        return;
    }

    // Handle IPFS-specific errors
    if (error.name === 'IpfsError') {
        res.status(400).json({
            success: false,
            message: 'IPFS Operation Failed',
            error: error.message
        });
        return;
    }

    // Handle file system errors
    if (error.code === 'ENOENT') {
        res.status(404).json({
            success: false,
            message: 'File not found',
            error: error.message
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: defaultMessage,
        error: error.message || 'Unknown error occurred'
    });
    return;
};

// File validation middleware
export const validateFileUpload = (req: any, res: any, next: Function) => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
        return;
    }

    // Validate file size (example: 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (req.file.size > maxSize) {
        res.status(400).json({
            success: false,
            message: 'File size exceeds limit (10MB)'
        });
        return;
    }

    // Validate file type (example: allow only certain mime types)
    const allowedTypes = ['image/jpeg', 'image/png', 'application/json'];
    if (!allowedTypes.includes(req.file.mimetype)) {
        res.status(400).json({
            success: false,
            message: 'Invalid file type. Allowed types: JPEG, PNG, JSON'
        });
        return;
    }

    next();
};
