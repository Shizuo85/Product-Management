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
const user_model_1 = __importDefault(require("../models/user.model"));
class UserRepo {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.create(data);
        });
    }
    findOne(filter_1) {
        return __awaiter(this, arguments, void 0, function* (filter, select = {}) {
            return yield user_model_1.default
                .findOne(Object.assign(Object.assign({}, filter), { is_deleted: false }))
                .select(select);
        });
    }
    updateOne(filter, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOneAndUpdate(Object.assign(Object.assign({}, filter), { is_deleted: false }), data, {
                upsert: false,
            });
        });
    }
    updateOneAndReturn(filter_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (filter, data, select = {}) {
            return yield user_model_1.default
                .findOneAndUpdate(Object.assign(Object.assign({}, filter), { is_deleted: false }), data, {
                new: true,
                upsert: false,
            })
                .select(select);
        });
    }
    deleteOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findOneAndUpdate(Object.assign(Object.assign({}, filter), { is_deleted: false }), {
                is_deleted: true,
            }, {
                upsert: false,
            });
        });
    }
}
exports.default = new UserRepo();
