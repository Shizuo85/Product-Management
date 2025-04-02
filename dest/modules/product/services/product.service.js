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
const mongoose_1 = require("mongoose");
const product_repo_1 = __importDefault(require("../repository/product.repo"));
class ProductService {
    createProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = new RegExp('^' + data.name + '$', 'i');
            const product = yield product_repo_1.default.findOne({
                name: { $in: [name] },
                creator: { $eq: data.creator },
            }, { _id: 1 });
            if (product) {
                const err = new Error('This product already exists');
                err.status = 400;
                throw err;
            }
            const new_prod = new mongoose_1.Types.ObjectId();
            yield product_repo_1.default.create(Object.assign({ _id: new_prod }, data));
            return {
                message: 'Product created succesfully',
                data: { product: new_prod },
            };
        });
    }
    fetchProducts(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                creator: { $eq: new mongoose_1.Types.ObjectId(data.user) },
            };
            if (data.search) {
                query.name = { $regex: data.search, $options: 'i' };
            }
            if (data.category) {
                query.category = data.category;
            }
            if (data.variant) {
                query.variant = data.variant;
            }
            const result = yield product_repo_1.default.fetchProducts(query, Math.abs(Number(data.limit) || 10), Math.abs(Number(data.page) || 1));
            return {
                message: 'Success',
                data: Object.assign({}, result),
            };
        });
    }
    editProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.name) {
                let name = new RegExp('^' + data.name + '$', 'i');
                const check = yield product_repo_1.default.findOne({
                    name: { $in: [name] },
                    creator: { $eq: data.user },
                });
                if (check) {
                    const err = new Error('This product already exists');
                    err.status = 400;
                    throw err;
                }
            }
            const product = yield product_repo_1.default.updateOne({
                _id: { $eq: data.id },
                creator: { $eq: data.user },
            }, data);
            if (!product) {
                const err = new Error('Product not found');
                err.status = 404;
                throw err;
            }
            return {
                message: 'success',
            };
        });
    }
    deleteProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_repo_1.default.deleteOne({
                _id: { $eq: data.id },
                creator: { $eq: data.user },
            });
            if (!product) {
                const err = new Error('Product not found');
                err.status = 404;
                throw err;
            }
            return;
        });
    }
}
exports.default = new ProductService();
