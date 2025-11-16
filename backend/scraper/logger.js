const winston = require('winston');
const path = require('path');

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Configura o logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            logFormat
        )
    }),
    // Salva o log na raiz da pasta 'backend'
    new winston.transports.File({ filename: path.join(__dirname, '../scraper-run.log') }),
  ],
});

module.exports = logger;