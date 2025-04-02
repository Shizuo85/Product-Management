"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const general_controller_1 = __importDefault(require("../modules/general/controllers/general.controller"));
const generalRouter = (0, express_1.Router)();
generalRouter.get("/", general_controller_1.default.default);
exports.default = generalRouter;
