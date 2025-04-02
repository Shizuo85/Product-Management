"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const logger_1 = require("./lib/logger");
const handlers_1 = __importDefault(require("./lib/handlers"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.json());
app.set('trust proxy', true);
app.use((req, res, next) => {
    logger_1.logger.info('Incoming request \nmethod %o, \npath %o, \nbody %o, \nparams %o, \nquery %o, \nheaders %o', req.method, req.originalUrl, req.body, req.params, req.query, req.headers);
    next();
});
app.use('/api/v1', routes_1.default);
app.use(handlers_1.default.Error404Handler);
app.use(handlers_1.default.errorHandler);
exports.default = app;
