/**
 * Centralized Winston logger for structured, leveled logging.
 * Automatically adjusts verbosity based on NODE_ENV.
 */
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'socket-server' },
  transports: [
    new transports.Console({ format: format.simple() })
  ],
});

export default logger;
