import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import CustomRequest from '../../../lib/custom.request';
import { encrypt } from '../../aes/aes.service';

class AuthController {
    async refreshLoginToken(
        req: CustomRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const expiresIn: any = process.env.LOGIN_JWT_EXPIRY
        
            const token = encrypt(
                jwt.sign(
                    {
                        user: req.user,
                        action: 'login_jwt',
                    },
                    process.env.JWT_SECRET!,
                    { expiresIn }
                )
            );
            return res
                .status(200)
                .json({
                    message: 'Token refreshed successfully',
                    data: { access_token: token },
                });
        } catch (err) {
            return next(err);
        }
    }
}

export default new AuthController();
