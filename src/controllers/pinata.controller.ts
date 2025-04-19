import { fetchFile, fetchUserFiles, uploadFileToPinata } from '../services/pinata.service';
import { Request, Response } from 'express';
import { handlePinataError, PinataError } from '../utils/pinata.error';


export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new PinataError('No file uploaded', 400);
        }
        const file = req.file;

        // Additional validation for file path
        if (!file.path || !file.filename) {
            throw new PinataError('Invalid file data', 400);
        }

        const response = await uploadFileToPinata(file.path, file.filename);
        console.log({ response })
        if (!response) {
            throw new PinataError('Failed to upload file to IPFS', 500);
        }

        res.status(201).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                ipfsUrl: response
            }
        });
        return;
    } catch (error) {
        return handlePinataError(error, res, 'File upload failed');
    }
};

export const getFile = async (req: Request, res: Response) => {
    try {
        const { ipfsHash } = req.params;
        // Validate IPFS hash format
        if (!ipfsHash || !/^[a-zA-Z0-9]{46}$/.test(ipfsHash)) {
            throw new PinataError('Invalid IPFS hash format', 400);
        }
        const file = await fetchFile(ipfsHash);
        if (!file) {
            throw new PinataError('File not found', 404);
        }
        res.status(200).json({
            success: true,
            data: file
        });
        return;
    } catch (error) {
        return handlePinataError(error, res, 'Failed to retrieve file');
    }
}

export const getUserFiles = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        // Validate user ID
        if (!userId || userId.trim().length === 0) {
            throw new PinataError('Invalid user ID', 400);
        }
        const files = await fetchUserFiles(userId);
        // Handle case when no files are found
        if (!files || files.length === 0) {
            res.status(200).json({
                success: true,
                message: 'No files found for this user',
                data: {
                    total: 0,
                    files: []
                }
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                total: files.length,
                files: files
            }
        });
        return;
    } catch (error) {
        return handlePinataError(error, res, 'Failed to retrieve user files');
    }
}