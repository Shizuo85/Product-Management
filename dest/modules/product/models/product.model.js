"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['shirts', 'skirts', 'socks', 'shorts', 'sweater'],
        requied: true,
    },
    variant: {
        type: String,
        enum: ['s', 'l', 'xl', 'xxl', 'xxxl'],
        requied: true,
    },
    inventory: {
        type: Number,
        default: 0,
        min: 0,
    },
    creator: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    is_deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });
productSchema.index({ creator: 1, name: 1 });
exports.default = mongoose_1.default.model('product', productSchema);
