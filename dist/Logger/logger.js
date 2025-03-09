"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = exports.logInfo = exports.logWarn = exports.logError = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};
const errorFileTransport = new winston_1.default.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '30d',
    zippedArchive: true,
});
const warnFileTransport = new winston_1.default.transports.DailyRotateFile({
    filename: 'logs/warn-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'warn',
    maxSize: '20m',
    maxFiles: '30d',
    zippedArchive: true,
});
const infoFileTransport = new winston_1.default.transports.DailyRotateFile({
    filename: 'logs/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    maxSize: '20m',
    maxFiles: '30d',
    zippedArchive: true,
});
const consoleTransport = new winston_1.default.transports.Console({
    level: 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.colorize({
        all: true,
        colors: {
            error: 'red',
            warn: 'yellow',
            info: 'green',
            debug: 'blue',
        },
    }), winston_1.default.format.simple()),
});
const logger = winston_1.default.createLogger({
    level: 'debug',
    levels: logLevels,
    transports: [
        errorFileTransport,
        warnFileTransport,
        infoFileTransport,
        consoleTransport,
    ],
});
exports.logger = logger;
const logError = (message) => logger.error(message);
exports.logError = logError;
const logWarn = (message) => logger.warn(message);
exports.logWarn = logWarn;
const logInfo = (message) => logger.info(message);
exports.logInfo = logInfo;
const logDebug = (message) => logger.debug(message);
exports.logDebug = logDebug;
