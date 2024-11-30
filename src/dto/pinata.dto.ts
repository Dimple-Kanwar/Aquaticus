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
