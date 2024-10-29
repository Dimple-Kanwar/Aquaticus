const mongoose = require('mongoose');

const NFTSchema = new mongoose.Schema({
    tokenId: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    owner: { 
        type: String, 
        required: true,
        index: true 
    },
    metadata: {
        name: String,
        description: String,
        image: String,
        attributes: [{
            trait_type: String,
            value: String
        }]
    },
    gameStats: {
        level: { type: Number, default: 1 },
        experience: { type: Number, default: 0 },
        power: { type: Number, default: 100 }
    },
    transactionHistory: [{
        from: String,
        to: String,
        timestamp: { type: Date, default: Date.now },
        transactionHash: String
    }]
}, {
    timestamps: true
});

NFTSchema.index({ 'metadata.name': 'text' });

module.exports = mongoose.model('NFT', NFTSchema);