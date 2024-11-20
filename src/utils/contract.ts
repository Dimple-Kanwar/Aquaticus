import { ethers } from 'ethers';

const CONTRACT_ABI = [
    "function safeMint(address to, string memory uri) public returns (uint256)",
];

export const contract = async () => {
    const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const nftContract =  new ethers.Contract(
        process.env.NFT_CONTRACT_ADDRESS!,
        CONTRACT_ABI,
        wallet
    );
    return {
        nftContract,
        wallet
    }
}