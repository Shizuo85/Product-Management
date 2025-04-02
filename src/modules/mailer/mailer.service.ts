import nodemailer from 'nodemailer';
const { MAIL_USERNAME, MAIL_PASSWORD } = process.env;

export default {
    transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: MAIL_USERNAME,
          pass: MAIL_PASSWORD,
        }
    }),
};

