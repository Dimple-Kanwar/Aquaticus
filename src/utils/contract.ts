import { ethers } from 'ethers';
import { abi } from "../../artifacts/contracts/NFT.sol/NFT.json";

const contract = async () => {
    const provider = new ethers.JsonRpcProvider(process.env.TESTNET_RPC);
    const signer = await provider.getSigner();
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
}


export default contract;