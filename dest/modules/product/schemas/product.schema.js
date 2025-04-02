"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
class ProductSchema {
    constructor() {
        this.createProduct = joi_1.default.object({
            name: joi_1.default.string()
                .required()
                .custom((value) => {
                return (0, sanitize_html_1.default)(value);
            }, 'Custom normalization')
                .trim(),
            category: joi_1.default.string()
                .trim()
                .valid('shirts', 'skirts', 'socks', 'shorts', 'sweater')
                .required(),
            variant: joi_1.default.string()
                .trim()
                .valid('s', 'l', 'xl', 'xxl', 'xxxl')
                .required(),
            inventory: joi_1.default.number().integer().min(0).required(),
        });
        this.fetchProducts = joi_1.default.object({
            search: joi_1.default.string()
                .custom((value) => {
                return (0, sanitize_html_1.default)(value);
            }, 'Custom normalization')
                .trim(),
            category: joi_1.default.string()
                .trim()
                .valid('shirts', 'skirts', 'socks', 'shorts', 'sweater'),
            variant: joi_1.default.string().trim().valid('s', 'l', 'xl', 'xxl', 'xxxl'),
            limit: joi_1.default.number().integer(),
            page: joi_1.default.number().integer(),
        });
        this.editProduct = joi_1.default.object({
            name: joi_1.default.string()
                .custom((value) => {
                return (0, sanitize_html_1.default)(value);
            }, 'Custom normalization')
                .trim(),
            category: joi_1.default.string()
                .trim()
                .valid('shirts', 'skirts', 'socks', 'shorts', 'sweater'),
            variant: joi_1.default.string().trim().valid('s', 'l', 'xl', 'xxl', 'xxxl'),
            inventory: joi_1.default.number().integer().min(0),
        }).or('name', 'category', 'variant', 'inventory');
    }
}
exports.default = new ProductSchema();
