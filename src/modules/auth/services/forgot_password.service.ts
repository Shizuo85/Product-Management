import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';

import { encrypt } from '../../aes/aes.service';
import { sendMail } from '../../mailer/mailer.controller';

import userRepo from '../../user/repository/user.repo';

class NewPasswordService {
    async forgotPassword(data: any) {
        const user = await userRepo.findOne(
            { email: { $eq: data.email } },
            { _id: 1 }
        );

        const resetToken: string = crypto.randomBytes(32).toString('hex');

        const otp: string = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        if (!user) {
            return {
                message:
                    'A password reset email has been sent to your registered address.',
                data: { token: resetToken },
            };
        }

        if (user.status == 'suspended') {
            const err: any = new Error('This User has been suspended');
            err.status = 400;
            throw err;
        }

        const hash = await bcrypt.hash(otp, 12);

        await userRepo.updateOne(
            { email: { $eq: data.email } },
            {
                password_reset_token: crypto
                    .createHash('sha256')
                    .update(resetToken)
                    .digest('hex'),
                password_reset_exp: new Date(Date.now() + 15 * 60 * 1000),
                password_reset_otp: hash,
            }
        );
        
        await sendMail(
            data.email,
            'Password Reset Request',
            `<p>Reset your password through this otp: ${otp}</p>`
        );

        return {
            message:
                'A password reset email has been sent to your registered address.',
            data: { token: resetToken },
        };
    }

    async forgotPasswordVerify(data: any) {
        const hashedToken: string = crypto
            .createHash('sha256')
            .update(data.token)
            .digest('hex');

        const user = await userRepo.findOne({
            password_reset_token: { $eq: hashedToken },
            password_reset_exp: { $gt: Date.now() },
        });

        if (!user) {
            const err: any = new Error('Token is invalid or has expired');
            err.status = 400;
            throw err;
        }

        const check = await bcrypt.compare(
            data.otp,
            user.password_reset_otp ? user.password_reset_otp : ''
        );

        if (!check) {
            const err: any = new Error('Invalid code');
            err.status = 400;
            throw err;
        }

        const expiresIn: any = process.env.JWT_EXPIRY;

        const token = encrypt(
            jwt.sign(
                {
                    user: user._id,
                    action: 'reset_jwt',
                },
                process.env.JWT_SECRET!,
                { expiresIn }
            )
        );

        return {
            message: `Code verified`,
            data: { token },
        };
    }

    async resetPassword(data: any) {
        const user = await userRepo.updateOne(
            {
                _id: { $eq: data.user },
            },
            {
                password: await bcrypt.hash(data.newPassword, 12),
            }
        );

        if (!user) {
            const err: any = new Error('User not found');
            err.status = 404;
            throw err;
        }

        await sendMail(
            user.email,
            'Password Reset Successful',
            `<p>Password Reset Successful</p>`
        );

        return {
            message: `Password reset successfully`,
        };
    }
}

export default new NewPasswordService();
