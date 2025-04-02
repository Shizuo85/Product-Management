import Joi from 'joi';
import sanitize from 'sanitize-html';

class ProductSchema {
    createProduct = Joi.object({
        name: Joi.string()
            .required()
            .custom((value) => { 
                return sanitize(value);
            }, 'Custom normalization')
            .trim(),
        category: Joi.string()
            .trim()
            .valid('shirts', 'skirts', 'socks', 'shorts', 'sweater')
            .required(),
        variant: Joi.string()
            .trim()
            .valid('s', 'l', 'xl', 'xxl', 'xxxl')
            .required(),
        inventory: Joi.number().integer().min(0).required(),
    });

    fetchProducts = Joi.object({
        search: Joi.string()
            .custom((value) => {
                return sanitize(value);
            }, 'Custom normalization')
            .trim(),
        category: Joi.string()
            .trim()
            .valid('shirts', 'skirts', 'socks', 'shorts', 'sweater'),
        variant: Joi.string().trim().valid('s', 'l', 'xl', 'xxl', 'xxxl'),
        limit: Joi.number().integer(),
        page: Joi.number().integer(),
    });

    editProduct = Joi.object({
        name: Joi.string()
            .custom((value) => {
                return sanitize(value);
            }, 'Custom normalization')
            .trim(),
        category: Joi.string()
            .trim()
            .valid('shirts', 'skirts', 'socks', 'shorts', 'sweater'),
        variant: Joi.string().trim().valid('s', 'l', 'xl', 'xxl', 'xxxl'),
        inventory: Joi.number().integer().min(0),
    }).or('name', 'category', 'variant', 'inventory');
}

export default new ProductSchema();
