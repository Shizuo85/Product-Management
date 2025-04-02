"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const aes_service_1 = require("../../aes/aes.service");
const user_repo_1 = __importDefault(require("../../user/repository/user.repo"));
const mailer_controller_1 = require("../../mailer/mailer.controller");
class VerificationService {
    verifyCode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repo_1.default.findOne({ _id: { $eq: data.user } });
            if (!user) {
                const err = new Error('Account not found');
                err.status = 400;
                throw err;
            }
            if (user.status == 'verified') {
                const err = new Error('Account has been verified already');
                err.status = 400;
                throw err;
            }
            if (user.status == 'suspended') {
                const err = new Error('Account has been suspended');
                err.status = 400;
                throw err;
            }
            const check = yield bcrypt_1.default.compare(`${data.code}`, user.verification_code);
            if (!check || user.verification_exp < new Date()) {
                const err = new Error('Invalid or expired token');
                err.status = 400;
                throw err;
            }
            yield user_repo_1.default.updateOne({ _id: { $eq: user._id } }, { status: 'verified' });
            let expiresIn = process.env.LOGIN_JWT_EXPIRY;
            const token = (0, aes_service_1.encrypt)(jsonwebtoken_1.default.sign({
                user: user._id,
                action: 'login_jwt',
            }, process.env.JWT_SECRET, { expiresIn }));
            expiresIn = process.env.REFRESH_JWT_EXPIRY;
            const refreshToken = (0, aes_service_1.encrypt)(jsonwebtoken_1.default.sign({
                user: user._id,
                action: 'refresh_jwt',
            }, process.env.JWT_SECRET, { expiresIn }));
            yield (0, mailer_controller_1.sendMail)(user.email, 'Welcome', `<p>Account verified successfully</p>`);
            return {
                message: 'Account verified successfully',
                data: {
                    access_token: token,
                    refresh_token: refreshToken,
                },
            };
        });
    }
    resendCode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repo_1.default.findOne({
                email: { $eq: data.email },
                status: { $eq: 'unverified' },
            });
            if (!user) {
                const err = new Error('Unverified account not found');
                err.status = 400;
                throw err;
            }
            const otp = otp_generator_1.default.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
            const token = (0, aes_service_1.encrypt)(jsonwebtoken_1.default.sign({ user: user._id, action: 'verify_jwt' }, process.env.JWT_SECRET));
            yield Promise.all([
                user_repo_1.default.updateOne({ email: { $eq: data.email }, status: { $eq: 'unverified' } }, {
                    verification_exp: new Date(Date.now() + +process.env.OTP_DURATION),
                    verification_code: yield bcrypt_1.default.hash(otp, 12),
                }),
                (0, mailer_controller_1.sendMail)(data.email, 'Account verification', `<p>Verify your account through this otp: ${otp}</p>`),
            ]);
            return {
                message: `Verification code has been resent to ${data.email}`,
                data: { email: data.email, token },
            };
        });
    }
}
exports.default = new VerificationService();
