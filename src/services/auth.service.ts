import ethers from 'ethers';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
const { ErrorHandler } = require('../utils/error').default;

class AuthService {
    static async verifySignature(signature: any, address: string, message: any) {
        const signerAddr = ethers.verifyMessage(message, signature);
        
        if (signerAddr.toLowerCase() !== address.toLowerCase()) {
            throw new ErrorHandler(401, 'Invalid signature');
        }
        
        return true;
    }

    static generateToken(address: any) {
        return jwt.sign(
            { address },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );
    }

    static async loginUser(signature: any, address: string, message: any) {
        await this.verifySignature(signature, address, message);
        
        let user = await User.findOne({ address });
        if (!user) {
            user = new User({
                address,
                nonce: ethers.randomBytes(32).toString('hex')
            });
            await user.save();
        }
        
        const token = this.generateToken(user.address);
        
        return { token, user };
    }
}

export default AuthService;
