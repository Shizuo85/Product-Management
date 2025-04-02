import Joi from 'joi';
import validator, { normalizeEmail } from 'validator';

class NewPasswordSchema {
    forgotPassword = Joi.object({
        email: Joi.string()
            .trim()
            .email()
            .required()
            .custom((value) => {
                return normalizeEmail(value);
            }, 'Custom normalization'),
    });

    forgotPasswordVerify = Joi.object({
        otp: Joi.string().trim().required(),
        token: Joi.string().trim().required(),
    });

    resetPassword = Joi.object({
        newPassword: Joi.string()
            .trim()
            .required()
            .min(8)
            .custom((value, helpers) => {
                if (
                    !validator.isStrongPassword(value, {
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    })
                ) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'Password Validation'),
        confirmPassword: Joi.string()
            .trim()
            .required()
            .valid(Joi.ref('newPassword'))
            .messages({ 'any.only': 'Passwords do not match' }),
    });
}

export default new NewPasswordSchema();
