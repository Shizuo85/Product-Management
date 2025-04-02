import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userRepo from '../../user/repository/user.repo';
import { sendMail } from '../../mailer/mailer.controller';
import { encrypt } from '../../aes/aes.service';

class LoginService {
    async emailLogin(data: any) {
        const user = await userRepo.findOne(
            { email: { $eq: data.email } },
            {
                password: 1,
                status: 1,
                first_name: 1
            }
        );

        if (!user) {
            const err: any = new Error('This account does not exist');
            err.status = 400;
            throw err;
        }

        const check = await bcrypt.compare(data.password, user.password);
        if (!check) {
            const err: any = new Error('Incorrect Email or Password');
            err.status = 400;
            throw err;
        }

        if (user.status == 'suspended') {
            const err: any = new Error('This User has been suspended');
            err.status = 400;
            throw err;
        }

        if (user.status == 'unverified') {
            const otp: string = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });

            const hashed: string = await bcrypt.hash(otp, 12);
            await userRepo.updateOne(
                { email: { $eq: data.email } },
                {
                    verification_code: hashed,
                    verification_exp: new Date(
                        Date.now() + +process.env.OTP_DURATION!
                    ),
                }
            );

            const expiresIn: any = process.env.VERIFY_JWT_EXPIRY;
            const token: string = encrypt(
                jwt.sign(
                    { user: user._id, action: 'verify_jwt' },
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
                message: `Your account is unverified. A verification code has been sent to ${data.email} `,
                data: { email: data.email, token },
            };
        } else {
            let expiresIn: any = process.env.LOGIN_JWT_EXPIRY;

            const token: string = encrypt(
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
                data.email,
                'Login Notification',
                `<p>Login Successful
                        Name: ${user.first_name}
                        Time: ${new Date().toUTCString()}
                        Ip Address: ${data.ip}
                </p>`
            );
            return {
                message: 'Login Successful',
                data: {
                    access_token: token,
                    refresh_token: refreshToken,
                },
            };
        }
    }
}

export default new LoginService();
