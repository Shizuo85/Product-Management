"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = __importDefault(require("../services/product.service"));
class ProductController {
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield product_service_1.default.createProduct(Object.assign(Object.assign({}, req.body), { creator: req.user }));
                return res.status(201).json(user);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    fetchProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield product_service_1.default.fetchProducts(Object.assign(Object.assign({}, req.query), { user: req.user }));
                return res.status(200).json(user);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    editProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield product_service_1.default.editProduct(Object.assign(Object.assign(Object.assign({}, req.params), req.body), { user: req.user }));
                return res.status(200).json(user);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    deleteProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield product_service_1.default.deleteProduct(Object.assign(Object.assign({}, req.params), { user: req.user }));
                return res.status(204).json(user);
            }
            catch (err) {
                return next(err);
            }
        });
    }
}
exports.default = new ProductController();
