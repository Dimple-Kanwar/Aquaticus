import { NFTMetadata } from "../dto/nft-metadata.dto";

export interface NFT {
    token_id: string;
    owner_address: string;
    metadata: NFTMetadata;
}

