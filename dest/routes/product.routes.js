"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = __importDefault(require("../modules/product/controllers/product.controller"));
const product_middleware_1 = __importDefault(require("../modules/product/middleware/product.middleware"));
const general_middleware_1 = __importDefault(require("../modules/general/middleware/general.middleware"));
const auth_middleware_1 = __importDefault(require("../modules/user/middleware/auth.middleware"));
const productRouter = (0, express_1.Router)();
productRouter.post('/create', auth_middleware_1.default, product_middleware_1.default.createProduct, product_controller_1.default.createProduct);
productRouter.get('/all', auth_middleware_1.default, product_middleware_1.default.fetchProducts, product_controller_1.default.fetchProducts);
productRouter.patch('/edit/:id', auth_middleware_1.default, general_middleware_1.default.sanitizeParams, product_middleware_1.default.editProduct, product_controller_1.default.editProduct);
productRouter.delete('/delete/:id', auth_middleware_1.default, general_middleware_1.default.sanitizeParams, product_controller_1.default.deleteProduct);
exports.default = productRouter;
