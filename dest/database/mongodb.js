"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const mongoose_1 = __importDefault(require("mongoose"));
function default_1(cb) {
    mongoose_1.default.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ACCESS_KEY}/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
        .then(() => {
        cb();
    })
        .catch(err => console.log(err));
}
