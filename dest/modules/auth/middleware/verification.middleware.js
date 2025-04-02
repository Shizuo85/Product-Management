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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const aes_service_1 = require("../../aes/aes.service");
const verification_schema_1 = __importDefault(require("../schemas/verification.schema"));
class VerificationMiddleware {
    verifyCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body = yield verification_schema_1.default.verifyCode.validateAsync(req.body);
                return next();
            }
            catch (err) {
                err.status = 400;
                return next(err);
            }
        });
    }
    resendCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body = yield verification_schema_1.default.resendCode.validateAsync(req.body);
                return next();
            }
            catch (err) {
                err.status = 422;
                return next(err);
            }
        });
    }
    verificationAuth(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const token = (_a = req.get("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    const err = new Error("Bad request, token missing");
                    err.status = 400;
                    throw err;
                }
                const payLoad = jsonwebtoken_1.default.verify((0, aes_service_1.decrypt)(token), process.env.JWT_SECRET);
                if ((payLoad === null || payLoad === void 0 ? void 0 : payLoad.action) != "verify_jwt") {
                    const err = new Error("Bad request, invalid token");
                    err.status = 400;
                    throw err;
                }
                req.user = payLoad === null || payLoad === void 0 ? void 0 : payLoad.user;
                return next();
            }
            catch (err) {
                err.status = (_b = err.status) !== null && _b !== void 0 ? _b : 400;
                return next(err);
            }
        });
    }
}
exports.default = new VerificationMiddleware();
