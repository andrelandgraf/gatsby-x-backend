const winston = require('winston');
const Transport = require('winston-transport');

const { ENV } = require('../enums');
const { sendSlack } = require('../actions');

const { combine, timestamp: ts, printf } = winston.format;

class SlackTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.name = 'Slack';
    this.label = opts.label;
    this.level = opts.level;
  }

  log(info, cb) {
    const { message, timestamp } = info;
    sendSlack(`ERROR: ${this.label} [${timestamp}]: ${message}`);
    cb();
  }
}

const logLevels = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  http: 'http',
  verbose: 'verbose',
  debug: 'debug',
  silly: 'silly',
};

const loggers = {};

/**
 * Configures the logging utility and returns a unique logger
 * for individual label.
 * @param logLabel Label to appear in logging
 * @returns {winston.Logger}
 */
console.tag = (logLabel = 'misc') => {
  const logger =
    loggers[logLabel] ||
    winston.createLogger({
      format: combine(
        winston.format.colorize(),
        ts(),
        printf(
          ({ level, message, timestamp }) =>
            `${timestamp} [${logLabel}] ${level}: ${message}`
        )
      ),
      transports: [
        new winston.transports.Console({
          level: ENV.LOG_LEVEL || logLevels.info,
          colorize: true,
          timestamp: true,
        }),
        new SlackTransport({
          level: logLevels.error,
          label: logLabel,
          timestamp: true,
        }),
      ],
      exitOnError: false,
    });
  if (!loggers[logLabel]) {
    loggers[logLabel] = logger;
  }
  return logger;
};
