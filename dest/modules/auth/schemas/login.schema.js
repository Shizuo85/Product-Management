"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validator_1 = require("validator");
class LoginSchema {
    constructor() {
        this.emailLogin = joi_1.default.object({
            email: joi_1.default.string()
                .trim()
                .email()
                .required()
                .custom((value) => {
                return (0, validator_1.normalizeEmail)(value);
            }, 'Custom normalization'),
            password: joi_1.default.string().trim().required(),
        });
    }
}
exports.default = new LoginSchema();
