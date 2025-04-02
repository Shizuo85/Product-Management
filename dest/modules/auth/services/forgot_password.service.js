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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const aes_service_1 = require("../../aes/aes.service");
const mailer_controller_1 = require("../../mailer/mailer.controller");
const user_repo_1 = __importDefault(require("../../user/repository/user.repo"));
class NewPasswordService {
    forgotPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repo_1.default.findOne({ email: { $eq: data.email } }, { _id: 1 });
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const otp = otp_generator_1.default.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
            if (!user) {
                return {
                    message: 'A password reset email has been sent to your registered address.',
                    data: { token: resetToken },
                };
            }
            if (user.status == 'suspended') {
                const err = new Error('This User has been suspended');
                err.status = 400;
                throw err;
            }
            const hash = yield bcrypt_1.default.hash(otp, 12);
            yield user_repo_1.default.updateOne({ email: { $eq: data.email } }, {
                password_reset_token: crypto_1.default
                    .createHash('sha256')
                    .update(resetToken)
                    .digest('hex'),
                password_reset_exp: new Date(Date.now() + 15 * 60 * 1000),
                password_reset_otp: hash,
            });
            yield (0, mailer_controller_1.sendMail)(data.email, 'Password Reset Request', `<p>Reset your password through this otp: ${otp}</p>`);
            return {
                message: 'A password reset email has been sent to your registered address.',
                data: { token: resetToken },
            };
        });
    }
    forgotPasswordVerify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedToken = crypto_1.default
                .createHash('sha256')
                .update(data.token)
                .digest('hex');
            const user = yield user_repo_1.default.findOne({
                password_reset_token: { $eq: hashedToken },
                password_reset_exp: { $gt: Date.now() },
            });
            if (!user) {
                const err = new Error('Token is invalid or has expired');
                err.status = 400;
                throw err;
            }
            const check = yield bcrypt_1.default.compare(data.otp, user.password_reset_otp ? user.password_reset_otp : '');
            if (!check) {
                const err = new Error('Invalid code');
                err.status = 400;
                throw err;
            }
            const expiresIn = process.env.JWT_EXPIRY;
            const token = (0, aes_service_1.encrypt)(jsonwebtoken_1.default.sign({
                user: user._id,
                action: 'reset_jwt',
            }, process.env.JWT_SECRET, { expiresIn }));
            return {
                message: `Code verified`,
                data: { token },
            };
        });
    }
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_repo_1.default.updateOne({
                _id: { $eq: data.user },
            }, {
                password: yield bcrypt_1.default.hash(data.newPassword, 12),
            });
            if (!user) {
                const err = new Error('User not found');
                err.status = 404;
                throw err;
            }
            yield (0, mailer_controller_1.sendMail)(user.email, 'Password Reset Successful', `<p>Password Reset Successful</p>`);
            return {
                message: `Password reset successfully`,
            };
        });
    }
}
exports.default = new NewPasswordService();
