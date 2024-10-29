import NFTService from '../services/nft.service';
import { catchAsync } from '../utils/catchAsync';

const mintNFT = catchAsync(async (req, res) => {
    const { tokenId, metadata } = req.body;
    const nft = await NFTService.mintNFT(tokenId, req.user.address, metadata);
    res.status(201).json(nft);
});

const transferNFT = catchAsync(async (req, res) => {
    const { toAddress } = req.body;
    const nft = await NFTService.transferNFT(
        req.params.tokenId,
        req.user.address,
        toAddress
    );
    res.json(nft);
});

const updateNFTStats = catchAsync(async (req, res) => {
    const nft = await NFTService.updateNFTStats(
        req.params.tokenId,
        req.user.address,
        req.body
    );
    res.json(nft);
});

module.exports = {
    mintNFT,
    transferNFT,
    updateNFTStats
};
