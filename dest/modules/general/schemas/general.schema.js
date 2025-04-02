"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
class GeneralSchema {
    constructor() {
        this.paramsId = joi_1.default.object({
            id: joi_1.default.string().trim()
                .custom((value, helpers) => {
                if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
                    return helpers.error('any.invalid');
                }
                return value;
            }, 'ID Validation')
                .required(),
        });
    }
}
exports.default = new GeneralSchema();
