/* eslint-disable no-shadow */
import { createLogger, format, transports, addColors, Logger } from 'winston';

const { colorize, combine, timestamp, label, printf, json } = format;

const custom = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    http: 5,
  },
  colors: {
    error: 'red',
    warn: 'orange',
    info: 'yellow',
    verbose: 'blue',
    debug: 'green',
    http: 'pink',
  },
};
addColors(custom.colors);

const myFormat = printf(({ level, message, label, timestamp, meta }) => `[${timestamp}] [${level}] [38; 5; 13m[1m =>[22m[39m ${message}`);

const logger = (value: string, route: string): Logger => {
  return createLogger({
    levels: custom.levels,
    format: combine(label({ label: value }), timestamp(), colorize({ colors: custom.colors }), json(), myFormat),
    transports: [new transports.Console()],
  });
};
export default logger;
