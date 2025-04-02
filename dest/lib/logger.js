"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { combine, splat, json, timestamp, errors, cli, printf } = winston_1.format;
const myFormat = printf((_a) => {
    var { level, timestamp, message } = _a, v = __rest(_a, ["level", "timestamp", "message"]);
    return `[${level}]: <${new Date(timestamp).toUTCString()}> ${message}\n${Object.keys(v).length ? JSON.stringify(v, null, 2) : ''}`;
});
const logTransports = [];
const console = new winston_1.transports.Console({ format: combine(cli(), myFormat) });
logTransports.push(console);
exports.logger = (0, winston_1.createLogger)({
    level: "debug",
    levels: winston_1.config.npm.levels,
    format: combine(timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), errors({ stack: true }), splat(), json({ space: 2 })),
    transports: logTransports,
});
