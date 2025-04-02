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
const login_schema_1 = __importDefault(require("../schemas/login.schema"));
class LoginMiddleware {
    emailLogin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                req.body = yield login_schema_1.default.emailLogin.validateAsync(req.body);
                let x = (req === null || req === void 0 ? void 0 : req.headers['x-forwarded-for']) ||
                    ((_a = req === null || req === void 0 ? void 0 : req.ip) === null || _a === void 0 ? void 0 : _a.split(':').pop()) ||
                    '';
                req.body.ip = typeof x == 'string' ? x.split(',')[0] : '1';
                return next();
            }
            catch (err) {
                err.status = 422;
                return next(err);
            }
        });
    }
}
exports.default = new LoginMiddleware();
