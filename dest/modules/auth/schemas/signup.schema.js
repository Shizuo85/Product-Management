"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validator_1 = __importStar(require("validator"));
class SignupSchema {
    constructor() {
        this.emailSignup = joi_1.default.object({
            email: joi_1.default.string()
                .trim()
                .email()
                .required()
                .custom((value) => {
                return (0, validator_1.normalizeEmail)(value);
            }, 'Custom normalization'),
            first_name: joi_1.default.string().trim().required(),
            last_name: joi_1.default.string().trim().required(),
            password: joi_1.default.string()
                .trim()
                .required()
                .min(8)
                .custom((value, helpers) => {
                if (!validator_1.default.isStrongPassword(value, {
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'Password Validation'),
            confirmPassword: joi_1.default.string()
                .trim()
                .required()
                .valid(joi_1.default.ref('password'))
                .messages({ 'any.only': 'Passwords do not match' }),
        });
    }
}
exports.default = new SignupSchema();
