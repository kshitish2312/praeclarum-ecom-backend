import winston from 'winston';
import 'winston-daily-rotate-file';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const errorFileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d',
  zippedArchive: true,
});

const warnFileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/warn-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'warn',
  maxSize: '20m',
  maxFiles: '30d',
  zippedArchive: true,
});

const infoFileTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/info-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'info',
  maxSize: '20m',
  maxFiles: '30d',
  zippedArchive: true,
});

const consoleTransport = new winston.transports.Console({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize({
      all: true,
      colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
      },
    }),
    winston.format.simple()
  ),
});

const logger = winston.createLogger({
  level: 'debug',
  levels: logLevels,
  transports: [
    errorFileTransport,
    warnFileTransport,
    infoFileTransport,
    consoleTransport,
  ],
});

const logError = (message: string) => logger.error(message);
const logWarn = (message: string) => logger.warn(message);
const logInfo = (message: string) => logger.info(message);
const logDebug = (message: string) => logger.debug(message);

export { logger, logError, logWarn, logInfo, logDebug };
