import { uploadFileToIPFS } from '../services/pinata.service';
import { Request, Response } from 'express';


export const uploadFile = async(req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
    }
    const file  = req.file!;
    const result =  await uploadFileToIPFS(file.path, file.filename);
    console.log({result})
    res.status(201).json(result);
};

// export const getFile = async (req: Request, res: Response) => {
//     const { tokenId } = req.params;
//     const nft = await getFile(tokenId);
//     res.json(nft);
// }