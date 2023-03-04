import { LoggerOptions } from 'pino';

export interface PrettyOptionsExtended extends LoggerOptions {
  prettyStamp: boolean;
  colors?: boolean;
}
