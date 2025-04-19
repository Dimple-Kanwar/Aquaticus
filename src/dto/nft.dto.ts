import { NFTMetadata } from "../dto/nft-metadata.dto";

export interface NFT {
    contract_address: string;
    token_id: string;
    owner_address: string;
    metadata: NFTMetadata;
}

