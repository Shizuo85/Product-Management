import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { encrypt } from '../../aes/aes.service';

import userRepo from '../../user/repository/user.repo';
import { sendMail } from '../../mailer/mailer.controller';

class SignupService {
    async emailSignup(data: any) {
        const check = await userRepo.findOne({ email: { $eq: data.email } });
        if (check) {
            const err: any = new Error(
                'An account with this email already exists'
            );
            err.status = 400;
            throw err;
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        const new_user: any = await userRepo.create({
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
            password: await bcrypt.hash(data.password, 12),
            verification_code: await bcrypt.hash(otp, 12),
            verification_exp: new Date(Date.now() + +process.env.OTP_DURATION!),
        });

        const expiresIn: any = process.env.VERIFY_JWT_EXPIRY;
        const token = encrypt(
            jwt.sign(
                { user: new_user._id, action: 'verify_jwt' },
                process.env.JWT_SECRET!,
                { expiresIn }
            )
        );

        await sendMail(
            data.email,
            'Account verification',
            `<p>Verify your account through this otp: ${otp}</p>`
        );
        return {
            message: `Account created, verification code has been sent to ${data.email}`,
            data: { email: data.email, token },
        };
    }
}

export default new SignupService();
