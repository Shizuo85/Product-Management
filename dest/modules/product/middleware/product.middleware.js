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
const product_schema_1 = __importDefault(require("../schemas/product.schema"));
class ProductMiddleware {
    createProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body = yield product_schema_1.default.createProduct.validateAsync(req.body);
                return next();
            }
            catch (err) {
                err.status = 422;
                return next(err);
            }
        });
    }
    fetchProducts(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.query = yield product_schema_1.default.fetchProducts.validateAsync(req.query);
                return next();
            }
            catch (err) {
                err.status = 422;
                return next(err);
            }
        });
    }
    editProduct(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body = yield product_schema_1.default.editProduct.validateAsync(req.body);
                return next();
            }
            catch (err) {
                err.status = 422;
                return next(err);
            }
        });
    }
}
exports.default = new ProductMiddleware();
