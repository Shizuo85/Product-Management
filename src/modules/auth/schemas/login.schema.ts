import Joi from 'joi';
import { normalizeEmail } from 'validator';

class LoginSchema {
    emailLogin = Joi.object({
        email: Joi.string()
            .trim()
            .email()
            .required()
            .custom((value) => {
                return normalizeEmail(value);
            }, 'Custom normalization'),
        password: Joi.string().trim().required(),
    });
}

export default new LoginSchema();
