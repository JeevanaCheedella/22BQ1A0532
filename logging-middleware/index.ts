/**
 * Log level types.
 */
export interface LogLevel {
  INFO: 'info';
  ERROR: 'error';
  WARN: 'warn';
  DEBUG: 'debug';
}

/**
 * Structure of a log entry.
 */
export interface LogData {
  level: string;
  message: string;
  timestamp: string;
  metadata?: any;
}

/**
 * Logger class for capturing and retrieving logs.
 */
class Logger {
  private logs: LogData[] = [];

  /**
   * Formats a log message.
   */
  private formatMessage(level: string, message: string, metadata?: any): LogData {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata
    };
  }

  /**
   * Logs an info message.
   */
  info(message: string, metadata?: any) {
    const logData = this.formatMessage('info', message, metadata);
    this.logs.push(logData);
    console.log(`[${logData.timestamp}] INFO: ${message}`, metadata || '');
  }

  /**
   * Logs an error message.
   */
  error(message: string, metadata?: any) {
    const logData = this.formatMessage('error', message, metadata);
    this.logs.push(logData);
    console.error(`[${logData.timestamp}] ERROR: ${message}`, metadata || '');
  }

  /**
   * Logs a warning message.
   */
  warn(message: string, metadata?: any) {
    const logData = this.formatMessage('warn', message, metadata);
    this.logs.push(logData);
    console.warn(`[${logData.timestamp}] WARN: ${message}`, metadata || '');
  }

  /**
   * Logs a debug message.
   */
  debug(message: string, metadata?: any) {
    const logData = this.formatMessage('debug', message, metadata);
    this.logs.push(logData);
    console.debug(`[${logData.timestamp}] DEBUG: ${message}`, metadata || '');
  }

  /**
   * Returns all logs.
   */
  getLogs(): LogData[] {
    return [...this.logs];
  }
}

export const logger = new Logger();