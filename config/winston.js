import winston from 'winston';
const { transports, format, createLogger } = winston;
const { combine, printf } = format;

// Create a timestamp
const logTime = new Date().toLocaleDateString();

const date = new Date();
const newDate = `${ date.getDate() }-${ date.getMonth() }-${date.getFullYear() } [TIME ${date.getHours() }:${date.getMinutes() }]`;


const customLog = printf(({ level, message }) => {
  return `Level:[${ level }] LogTime:[${ newDate}] Message:-[${ message }]`
});

const options = {
  info: {
    level: 'info',
    dirname: 'logs/combined',
    json: true,
    handleExceptions: true,
    datePattern: 'YYYY-MM-DD-HH',
    fileName: `combined-${ newDate }.log`,
  },
  error: {
    level: 'error',
    dirname: 'logs/error',
    json: true,
    handleExceptions: true,
    fileName : `error-${ newDate }.log`,
  },
  console: {
    level: 'debug',
    json: false,
    handleExceptions: true,
    colorize: true
  },
}

export const logger = new createLogger({
  format: combine(customLog), transports: [
    new transports.File(options.info),
    new transports.File(options.error),
    new transports.Console(options.console),
  ], exitOnError: false
});

export default logger;