import { fetchFile, fetchUserFiles, uploadFileToPinata } from '../services/pinata.service';
import { Request, Response } from 'express';


export const uploadFile = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
    }
    const file = req.file!;
    const result = await uploadFileToPinata(file.path, file.filename);
    console.log({ result })
    res.status(201).json(result);
};

export const getFile = async (req: Request, res: Response) => {
    const { ipfsHash } = req.params;
    const file = await fetchFile(ipfsHash);
    res.json(file);
}

export const getUserFiles = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const files = await fetchUserFiles(userId);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve files' });
    }
}