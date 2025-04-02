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
const product_model_1 = __importDefault(require("../models/product.model"));
class ProductRepo {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.create(data);
        });
    }
    findOne(filter_1) {
        return __awaiter(this, arguments, void 0, function* (filter, select = {}) {
            return yield product_model_1.default
                .findOne(Object.assign(Object.assign({}, filter), { is_deleted: false }))
                .select(select);
        });
    }
    updateOne(filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.findOneAndUpdate(Object.assign(Object.assign({}, filter), { is_deleted: false }), data, {
                upsert: false,
            });
        });
    }
    updateOneAndReturn(filter_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (filter, data, select = {}) {
            return yield product_model_1.default
                .findOneAndUpdate(Object.assign(Object.assign({}, filter), { is_deleted: false }), data, {
                new: true,
                upsert: false,
            })
                .select(select);
        });
    }
    deleteOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.findOneAndUpdate(Object.assign(Object.assign({}, filter), { is_deleted: false }), {
                is_deleted: true,
            }, {
                upsert: false,
            });
        });
    }
    fetchProducts(filter, limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const [{ products, count }] = yield product_model_1.default.aggregate([
                {
                    $match: Object.assign(Object.assign({}, filter), { is_deleted: false }),
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'creator',
                        foreignField: '_id',
                        as: 'creator',
                        pipeline: [
                            {
                                $project: {
                                    _id: 1,
                                    name: {
                                        $concat: [
                                            { $ifNull: ['$first_name', ''] },
                                            {
                                                $cond: [
                                                    {
                                                        $and: [
                                                            {
                                                                $ne: [
                                                                    {
                                                                        $toString: '$first_name',
                                                                    },
                                                                    null,
                                                                ],
                                                            },
                                                            {
                                                                $ne: [
                                                                    {
                                                                        $toString: '$last_name',
                                                                    },
                                                                    null,
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                    ' ',
                                                    '',
                                                ],
                                            },
                                            { $ifNull: ['$last_name', ''] },
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: {
                        path: '$creator',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        category: 1,
                        inventory: 1,
                        variant: 1,
                        creator: 1,
                    },
                },
                {
                    $sort: {
                        category: 1,
                        name: 1,
                    },
                },
                {
                    $facet: {
                        products: [
                            {
                                $skip: (page - 1) * limit,
                            },
                            {
                                $limit: limit,
                            },
                        ],
                        count: [
                            {
                                $count: 'count',
                            },
                        ],
                    },
                },
            ]);
            const total_count = (_b = (_a = count[0]) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0;
            const total_pages = Math.ceil(total_count / limit);
            return {
                products,
                total_count,
                page,
                total_pages,
            };
        });
    }
}
exports.default = new ProductRepo();
