import pinataSDK from '@pinata/sdk';
import { createReadStream } from 'fs';
require('dotenv').config();

class IPFSService {
    constructor() {
        this.pinata = new pinataSDK(
            process.env.PINATA_API_KEY,
            process.env.PINATA_SECRET_KEY
        );
    }
    
    async uploadMetadata(metadata) {
        try {
            const result = await this.pinata.pinJSONToIPFS(metadata, {
                pinataMetadata: {
                    name: `${metadata.name}-metadata`
                }
            });
            
            return `ipfs://${result.IpfsHash}`;
        } catch (error) {
            console.error('Error uploading metadata:', error);
            throw error;
        }
    }
    
    async uploadImage(imagePath) {
        try {
            const readableStreamForFile = createReadStream(imagePath);
            const result = await this.pinata.pinFileToIPFS(readableStreamForFile, {
                pinataMetadata: {
                    name: `NFT-Image-${Date.now()}`
                }
            });
            
            return `ipfs://${result.IpfsHash}`;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
    
    async createAndUploadMetadata(name, description, imagePath, attributes = []) {
        try {
            // First upload the image
            const imageUri = await this.uploadImage(imagePath);
            
            // Create metadata
            const metadata = {
                name,
                description,
                image: imageUri,
                attributes
            };
            
            // Upload metadata
            return await this.uploadMetadata(metadata);
        } catch (error) {
            console.error('Error creating and uploading metadata:', error);
            throw error;
        }
    }
}

export default IPFSService;

// Example usage:
async function mintNFTWithMetadata(
    name,
    description,
    imagePath,
    attributes,
    contract
) {
    const ipfsService = new IPFSService();
    
    try {
        // Upload metadata to IPFS
        const tokenUri = await ipfsService.createAndUploadMetadata(
            name,
            description,
            imagePath,
            attributes
        );
        
        // Mint NFT with the returned tokenUri
        const tx = await contract.mint(tokenUri, {
            value: ethers.parseEther("0.05")
        });
        await tx.wait();
        
        console.log('NFT minted successfully!');
        return tokenUri;
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
}