import { createLogger, format, transports } from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logDir = path.join(__dirname, 'log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const auditFilter = format((info) => {
  return info.isAudit ? info : false; 
});


export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YY:MM:DD HH:mm:ss' }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'access.log'), level: 'info' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
    new transports.File({ filename: path.join(logDir, 'custom.log'), level: 'warn' }),
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({
      filename: path.join(logDir, 'audit.log'),
      level: 'info',
      format: format.combine(auditFilter())
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}
export const logAction = (action, admin, status = 'success', message = '', level = 'info') => {
  logger.log({
    level: level,
    isAudit: true, 
    timestamp: new Date().toISOString(),
    action,
    admin: admin ? admin.username : 'Unknown Admin',
    status,
    message
  });
};
