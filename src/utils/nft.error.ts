import { Response } from "express";
import { validationResult } from "express-validator";

// Custom error types
export class NFTError extends Error {
    constructor(
        message: string,
        public code: number = 500,
        public data?: any
    ) {
        super(message);
        this.name = 'NFTError';
    }
}

// Error handler wrapper
export const handleControllerError = (error: any, res: Response, defaultMessage: string) => {
    console.error(`NFT Controller Error:`, error);

    if (error instanceof NFTError) {
        res.status(error.code).json({
            success: false,
            message: error.message,
            data: error.data
        });
        return;
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: error.errors
        });
        return;
    }

    // Handle blockchain-specific errors
    if (error.code === 'CALL_EXCEPTION' || error.reason) {
         res.status(400).json({
            success: false,
            message: error.reason || 'Blockchain operation failed',
            error: error.code
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

// Validation middleware
const validateRequest = (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: errors.array()
        });
        return;
    }
    next();
};
