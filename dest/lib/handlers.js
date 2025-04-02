"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const multer_1 = __importDefault(require("multer"));
class Handlers {
    errorHandler(err, req, res, next) {
        console.log(err);
        if (err instanceof multer_1.default.MulterError) {
            if (err.code === 'LIMIT_FIELD_COUNT') {
                return res.status(400).json({
                    error: 'File size is too large, limit 15MB',
                });
            }
            else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    error: 'Invalid upload detected',
                });
            }
        }
        else if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({
                error: 'Token expired',
            });
        }
        else if (err.name === 'CastError' && err.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
            });
        }
        else if (err instanceof SyntaxError &&
            ('body' in err || 'query' in err)) {
            return res.status(400).json({
                error: 'Bad request - Invalid input parameter(s)',
            });
        }
        else if (err instanceof TypeError) {
            return res.status(400).json({
                error: 'Bad request - Invalid parameter',
            });
        }
        return res
            .status(err.status || 500)
            .json({ error: err.message || err });
    }
    Error404Handler(req, res, next) {
        return res.status(404).json({ error: 'Oops, no page found!' });
    }
}
exports.default = new Handlers();
