import Joi from 'joi';
import { normalizeEmail } from 'validator';

class VerificationSchema {
    verifyCode = Joi.object({
        code: Joi.string().trim().required(),
    });

    resendCode = Joi.object({
        email: Joi.string()
            .trim()
            .email()
            .required()
            .custom((value) => {
                return normalizeEmail(value);
            }, 'Custom normalization'),
    });
}

export default new VerificationSchema();
