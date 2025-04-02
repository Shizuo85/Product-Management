import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { encrypt } from '../../aes/aes.service';

import userRepo from '../../user/repository/user.repo';
import { sendMail } from '../../mailer/mailer.controller';

class VerificationService {
    async verifyCode(data: any) {
        const user: any = await userRepo.findOne({ _id: { $eq: data.user } });
        if (!user) {
            const err: any = new Error('Account not found');
            err.status = 400;
            throw err;
        }
        if (user.status == 'verified') {
            const err: any = new Error('Account has been verified already');
            err.status = 400;
            throw err;
        }
        if (user.status == 'suspended') {
            const err: any = new Error('Account has been suspended');
            err.status = 400;
            throw err;
        }
        const check = await bcrypt.compare(
            `${data.code}`,
            user.verification_code
        );

        if (!check || user.verification_exp < new Date()) {
            const err: any = new Error('Invalid or expired token');
            err.status = 400;
            throw err;
        }

        await userRepo.updateOne(
            { _id: { $eq: user._id } },
            { status: 'verified' }
        );
        let expiresIn: any = process.env.LOGIN_JWT_EXPIRY;

        const token = encrypt(
            jwt.sign(
                {
                    user: user._id,
                    action: 'login_jwt',
                },
                process.env.JWT_SECRET!,
                { expiresIn }
            )
        );
        expiresIn = process.env.REFRESH_JWT_EXPIRY;

        const refreshToken = encrypt(
            jwt.sign(
                {
                    user: user._id,
                    action: 'refresh_jwt',
                },
                process.env.JWT_SECRET!,
                { expiresIn }
            )
        );

        await sendMail(
            user.email,
            'Welcome',
            `<p>Account verified successfully</p>`
        );

        return {
            message: 'Account verified successfully',
            data: {
                access_token: token,
                refresh_token: refreshToken,
            },
        };
    }

    async resendCode(data: any) {
        const user = await userRepo.findOne({
            email: { $eq: data.email },
            status: { $eq: 'unverified' },
        });
        if (!user) {
            const err: any = new Error('Unverified account not found');
            err.status = 400;
            throw err;
        }
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });
        const token = encrypt(
            jwt.sign(
                { user: user._id, action: 'verify_jwt' },
                process.env.JWT_SECRET!
            )
        );
        await Promise.all([
            userRepo.updateOne(
                { email: { $eq: data.email }, status: { $eq: 'unverified' } },
                {
                    verification_exp: new Date(
                        Date.now() + +process.env.OTP_DURATION!
                    ),
                    verification_code: await bcrypt.hash(otp, 12),
                }
            ),
            sendMail(
                data.email,
                'Account verification',
                `<p>Verify your account through this otp: ${otp}</p>`
            ),
        ]);
        return {
            message: `Verification code has been resent to ${data.email}`,
            data: { email: data.email, token },
        };
    }
}

export default new VerificationService();
