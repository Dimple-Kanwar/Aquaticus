import pinataSDK from '@pinata/sdk';
import fs from "fs";
import "dotenv/config";
import axios from "axios";

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

export const uploadFileToIPFS = async (filePath: fs.PathLike, fileName: string) => {
    return await pinata.pinFileToIPFS(
        fs.createReadStream(filePath),
        {
            pinataMetadata: {
                name: fileName,
            },
            pinataOptions: {
                cidVersion: 0,
            },
        },
    )
        .then(function (response) {
            console.log("file uploaded", response.IpfsHash)
            return {
                success: true,
                message: "File uploaded successfully!",
                result: `${process.env.PINATA_DOMAIN}${response.IpfsHash}`
            };
        })
        .catch(function (error) {
            console.log({ error })
            return {
                success: false,
                message: error.message,
                result: null
            }
        });
}

// export const fetchFile = async (ipfsHash:string) => {
//     return await pinata.pinList({hashContains: ipfsHash});;
// }

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
