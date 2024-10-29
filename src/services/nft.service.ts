import NFT from '../models/nft.model';
import User from '../models/user.model';
const { ErrorHandler } = require('../utils/error').default;

class NFTService {
    static async mintNFT(tokenId: any, owner: any, metadata: any) {
        const nft = new NFT({
            tokenId,
            owner,
            metadata
        });
        
        await nft.save();
        
        await User.findOneAndUpdate(
            { address: owner },
            { $push: { ownedNFTs: nft._id } }
        );
        
        return nft;
    }

    static async transferNFT(tokenId: any, fromAddress: any, toAddress: any) {
        const nft = await NFT.findOne({ tokenId });
        
        if (!nft) throw new ErrorHandler(404, 'NFT not found');
        if (nft.owner !== fromAddress) throw new ErrorHandler(403, 'Not authorized');
        
        nft.transactionHistory.push({
            from: fromAddress,
            to: toAddress
        });
        nft.owner = toAddress;
        
        await nft.save();
        
        await User.findOneAndUpdate(
            { address: fromAddress },
            { $pull: { ownedNFTs: nft._id } }
        );
        
        await User.findOneAndUpdate(
            { address: toAddress },
            { $push: { ownedNFTs: nft._id } }
        );
        
        return nft;
    }

    static async updateNFTStats(tokenId: any, owner: any, stats: any) {
        const nft = await NFT.findOne({ tokenId });
        
        if (!nft) throw new ErrorHandler(404, 'NFT not found');
        if (nft.owner !== owner) throw new ErrorHandler(403, 'Not authorized');
        
        nft.gameStats = {
            ...nft.gameStats,
            ...stats
        };
        
        return nft.save();
    }
}

module.exports = NFTService;