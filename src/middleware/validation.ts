import { body } from 'express-validator';

// Validation middleware
export const validateNFTMetadata = [
    body('name').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('attributes').optional().isArray(),
];
