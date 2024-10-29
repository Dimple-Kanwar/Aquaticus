import AuthService from '../services/auth.service';
import { catchAsync } from '../utils/catchAsync';

const login = catchAsync(async (req: { body: { signature: any; address: any; message: any; }; }, res: { json: (arg0: { token: any; user: any; }) => void; }) => {
    const { signature, address, message } = req.body;
    const { token, user } = await AuthService.loginUser(signature, address, message);
    res.json({ token, user });
});

export default login;
