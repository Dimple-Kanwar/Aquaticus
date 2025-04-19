import { ethers } from 'ethers';
import CONTRACT_ABI from "../../artifacts/contracts/NFT.sol/AquaticusNFTUpgradeable.json";


export const contract = async () => {
    const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const nftContract =  new ethers.Contract(
        process.env.NFT_CONTRACT_ADDRESS!,
        CONTRACT_ABI.abi,
        wallet
    );
    return {
        nftContract,
        wallet
    }
}