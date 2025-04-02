"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const { MAIL_USERNAME, MAIL_PASSWORD } = process.env;
exports.default = {
    transporter: nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD,
        }
    }),
};
