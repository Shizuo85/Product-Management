import Joi from 'joi';
import mongoose from 'mongoose';

class GeneralSchema {
    paramsId = Joi.object({
        id: Joi.string().trim()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'ID Validation')
            .required(),
    });
}

export default new GeneralSchema();
