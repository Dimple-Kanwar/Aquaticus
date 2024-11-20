export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
}


export interface NFT {
    contract_address: string;
    token_id: string;
    owner_address: string;
    metadata: NFTMetadata;
}

export interface PinataFile {
    id: string;
    ipfs_pin_hash: string;
    size: number;
    user_id: string;
    date_pinned: Date;
    metadata: {
        name?: string;
        keyvalues?: Record<string, string>;
    };
}