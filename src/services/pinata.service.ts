import pinataSDK from '@pinata/sdk';
import fs from "fs";
import "dotenv/config";

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

export const uploadFileToIPFS = async(filePath: fs.PathLike, fileName: string) => {
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
        console.log({error})
        return {
            success: false,
            message: error.message,
            result: null
        }
    });
}
