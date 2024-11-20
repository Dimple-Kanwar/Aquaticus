import { ethers } from "ethers";
import { contract } from "../utils/contract";
import { uploadFileToPinata, uploadMetadataToPinata } from "./pinata.service";
import { NFTMetadata } from "../interfaces";


export const mintNFT = async (body: any, file: Express.Multer.File) => {
  // Upload image to Pinata
  const uploadResponse = await uploadFileToPinata(
    file.path,
    file.originalname
  );
  const imageHash = uploadResponse.result;
  // Create metadata
  const metadata: NFTMetadata = {
    name: body.name,
    description: body.description,
    image: `${imageHash}`,
    attributes: JSON.parse(body.attributes),
  };
  // Upload metadata to Pinata
  const metadataHash = await uploadMetadataToPinata(metadata);
  const nftContract = (await contract()).nftContract;
  const wallet = (await contract()).wallet;
  // Mint NFT
  const tx = await nftContract.safeMint(
    body.recipient || wallet.address,
    `ipfs://${metadataHash}`
  );
  const receipt = await tx.wait();
  return {
    success: true,
    transactionHash: tx.hash,
    metadata: `ipfs://${metadataHash}`,
    image: imageHash,
    receipt
  };
}

export const viewNFT = async () => {

}

export const listNFTByUser = async (userAddress: string) => {
  try {
    // const response = await axios.get('https://deep-index.moralis.io/api/v2.2/wallets/{address}/tokens', {
    //   headers: {
    //     'X-API-Key': this.moralisApiKey
    //   },
    //   params: {
    //     chain: 'eth', // Ethereum mainnet
    //     token_type: 'ERC721,ERC1155' // NFT token types
    //   }
    // });

    // return response.data.result.map((nft: any) => ({
    //   contract_address: nft.token_address,
    //   token_id: nft.token_id,
    //   owner_address: userAddress,
    //   metadata: {
    //     name: nft.name,
    //     description: nft.description,
    //     image: nft.image,
    //     attributes: nft.attributes ? JSON.parse(nft.attributes) : []
    //   }
    // }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw new Error('Unable to retrieve NFTs');
  }
}
