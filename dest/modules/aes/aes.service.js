"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto_1 = __importDefault(require("crypto"));
function encrypt(text) {
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPT_KEY, 'hex'), Buffer.from(process.env.ENCRYPT_IV, 'hex'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
function decrypt(encryptedText) {
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(process.env.ENCRYPT_KEY, 'hex'), Buffer.from(process.env.ENCRYPT_IV, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
