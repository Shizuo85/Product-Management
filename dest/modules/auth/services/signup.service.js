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
class SignupService {
    emailSignup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield user_repo_1.default.findOne({ email: { $eq: data.email } });
            if (check) {
                const err = new Error('An account with this email already exists');
                err.status = 400;
                throw err;
            }
            const otp = otp_generator_1.default.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });
            const new_user = yield user_repo_1.default.create({
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                role: data.role,
                password: yield bcrypt_1.default.hash(data.password, 12),
                verification_code: yield bcrypt_1.default.hash(otp, 12),
                verification_exp: new Date(Date.now() + +process.env.OTP_DURATION),
            });
            const expiresIn = process.env.VERIFY_JWT_EXPIRY;
            const token = (0, aes_service_1.encrypt)(jsonwebtoken_1.default.sign({ user: new_user._id, action: 'verify_jwt' }, process.env.JWT_SECRET, { expiresIn }));
            yield (0, mailer_controller_1.sendMail)(data.email, 'Account verification', `<p>Verify your account through this otp: ${otp}</p>`);
            return {
                message: `Account created, verification code has been sent to ${data.email}`,
                data: { email: data.email, token },
            };
        });
    }
}
exports.default = new SignupService();
