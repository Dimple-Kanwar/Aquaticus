import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    address: { 
        type: String, 
        required: true, 
        unique: true,
        index: true 
    },
    nonce: { 
        type: String, 
        required: true 
    },
    ownedNFTs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'NFT' 
    }],
    gameProfile: {
        level: { type: Number, default: 1 },
        experience: { type: Number, default: 0 },
        achievements: [String]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);