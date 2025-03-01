import { contract } from "../utils/contract";
import { fetchFile, uploadFileToPinata, uploadMetadataToPinata, deleteFromPinata } from "./pinata.service";
import { readFileSync } from "fs";
import axios from "axios";
import { MintNFTDto } from "../dto/mint-nft.dto";
import { NFTMetadata } from "../dto/nft-metadata.dto";
import { NFT } from "../dto/nft.dto";
import { AddressLike, TransactionReceipt } from "ethers";

export const mintNFT = async (body: MintNFTDto, nftFile: Express.Multer.File, metadataFile: Express.Multer.File) => {
  try {
    // Upload nft images file to Pinata
    const uploadResponse = await uploadFileToPinata(
      nftFile.path,
      nftFile.originalname
    );
    const metadataContent = readFileSync(metadataFile.path, { encoding: "ascii"});
    const metadataObj = JSON.parse(metadataContent);
    const fileHash = uploadResponse.result;
    const attributes = metadataObj.attributes;
    // Create metadata
    const metadata: NFTMetadata = {
      name: metadataObj.name,
      description: metadataObj.description,
      image: `${fileHash}`,
      attributes,
    };
    // Upload metadata to Pinata
    const metadataURL = await uploadMetadataToPinata(metadata);
    const nftContract = (await contract()).nftContract;
    const wallet = (await contract()).wallet;

    // Mint NFT
    const tx = await nftContract.mintNFT(
      body.recipient || wallet.address,
      `${metadataURL}`
    );
    const receipt = await tx.wait();
    const tokenId = Number(receipt.logs[0].args[2]);
    return {
      tokenId,
      success: true,
      transactionHash: tx.hash
    };
  } catch (error) {
    console.error('Error in mintNFT:', error);
    throw error;
  }
}


export const getNftsByOwner = async (ownerAddress: string): Promise<NFT[]> => {
  try {
    const nftContract = (await contract()).nftContract;
    const balance = await nftContract.balanceOf(ownerAddress);
    console.log({ balance })
    const nfts = [];

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await nftContract.tokenOfOwnerByIndex(ownerAddress, i);
      const tokenUri = await nftContract.tokenURI(tokenId);

      // Fetch metadata from IPFS
      const metadataResponse = await axios.get(
        tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
      );
      nfts.push({
        contract_address: nftContract.target.toString(),
        owner_address: ownerAddress,
        token_id: tokenId.toString(),
        metadata: metadataResponse.data
      });
    }

    return nfts;
  } catch (error) {
    console.error('Error in getAllNftsByOwner:', error);
    throw new Error('Failed to retrieve NFTs');
  }
}

// Get NFT by tokenId
export const getNFTById = async (tokenId: number) => {
  // Additional validation if needed
  if (!tokenId) {
    throw new Error('Token Id is required');
  }
  try {
    const nftContract = (await contract()).nftContract;
    const tokenURI = await nftContract.tokenURI(tokenId);
    console.log({ tokenURI });
    const nftFile = await fetchFile(tokenURI);
    console.log({ nftFile });
    return { tokenId, ...nftFile };
  } catch (error) {
    console.error('Error in getNFTById:', error);
    throw error;
  }
}

// Transfer NFT from the nft holder to new nft receiver
export const _transferNFT = async (from: AddressLike, to: AddressLike, tokenId: number) => {

  const nftContract = (await contract()).nftContract;

  // verify ownership
  const owner = await nftContract.ownerOf(tokenId);
  if (owner != from) {
    throw new Error("From address is not the token owner.");
  }

  const wallet = (await contract()).wallet;
  const tx = await nftContract.transferFrom(from, to, tokenId);
  const receipt: TransactionReceipt = await tx.wait();
  return receipt.hash;
}

// Burn NFT
export const _burnNFT = async (tokenId: number) => {
    const nftContract = (await contract()).nftContract;
    const tokenURI = await nftContract.tokenURI(tokenId);
    const ipfsHash = tokenURI.replace('ipfs://', '');
    const tx = await nftContract.burnNFT(tokenId);
    const receipt = await tx.wait();
    const unpinFile = await deleteFromPinata(ipfsHash);
    console.log({unpinFile});
    const metadataIpfsHash = ipfsHash + ".json";
    const unpinMetadata = await deleteFromPinata(metadataIpfsHash);
    console.log({unpinMetadata});
    return receipt;
};