"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const general_routes_1 = __importDefault(require("./general.routes"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const router = (0, express_1.Router)();
router.use("/", general_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.use("/product", product_routes_1.default);
exports.default = router;
