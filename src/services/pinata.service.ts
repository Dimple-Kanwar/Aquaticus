import pinataSDK from '@pinata/sdk';
import fs from "fs";
import "dotenv/config";
import axios from "axios";
import { NFTMetadata, PinataFile } from '../interfaces';

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

// Upload file to Pinata
export const uploadFileToPinata = async (filePath: fs.PathLike, fileName: string) => {
  return await pinata.pinFileToIPFS(
    fs.createReadStream(filePath),
    {
      pinataMetadata: {
        name: fileName,
      }
    },
  )
    .then(function (response) {
      console.log("file uploaded: ", response.IpfsHash);
      
      // Cleanup uploaded file
      fs.unlinkSync(filePath);

      return {
        success: true,
        message: "File uploaded successfully!",
        result: `${process.env.PINATA_DOMAIN}${response.IpfsHash}`
      };
    })
    .catch(function (error) {
      console.log(`Failed to upload file to Pinata: ${error}`);
      return {
        success: false,
        message: error.message,
        result: null
      };
    });
}

// Upload metadata to Pinata

export const uploadMetadataToPinata = async (metadata: NFTMetadata) => {
  try {
      const result = await pinata.pinJSONToIPFS(metadata);
      return `${process.env.PINATA_DOMAIN}${result.IpfsHash}`;
  } catch (error) {
      throw new Error(`Failed to upload metadata to Pinata: ${error}`);
  }
}

export const fetchFile = async (ipfsHash: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.PINATA_DOMAIN}${ipfsHash}`
  };

  return axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

export const fetchUserFiles = async (userId: string): Promise<PinataFile[]> => {
  try {
    const response = await axios.get('https://api.pinata.cloud/data/pinList', {
      headers: {
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_API_SECRET
      },
      params: {
        status: 'pinned',
        metadata: JSON.stringify({
          keyvalues: {
            userId: {
              value: userId,
              op: 'eq'
            }
          }
        })
      }
    });

    return response.data.rows.map((file: any) => ({
      id: file.id,
      ipfs_pin_hash: file.ipfs_pin_hash,
      size: file.size,
      user_id: file.metadata.keyvalues.userId,
      date_pinned: new Date(file.date_pinned),
      metadata: {
        name: file.metadata.name,
        keyvalues: file.metadata.keyvalues
      }
    }));
  } catch (error) {
    console.error('Error fetching Pinata files:', error);
    throw new Error('Unable to retrieve files');
  }
}

export const getNFTMetadataFromPinata = async (metadataHash: string) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.PINATA_DOMAIN}${metadataHash}`
  };

  return axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}