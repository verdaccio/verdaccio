import { inspect } from 'util';
import { calculateLevel, LevelCode, levelsColors, subSystemLevels } from '../levels';
import { padLeft, padRight } from '../utils';
import { white, red, green } from 'kleur';
import _ from 'lodash';
import dayjs from 'dayjs';
import { PrettyOptions } from 'pino';

export const CUSTOM_PAD_LENGTH = 1;
export const FORMAT_DATE = 'YYYY-MM-DD HH:mm:ss';

export function isObject(obj: unknown): boolean {
  return _.isObject(obj) && _.isNull(obj) === false && _.isArray(obj) === false;
}

export function formatLoggingDate(time: number, message): string {
  const timeFormatted = dayjs(time).format(FORMAT_DATE);

  return `[${timeFormatted}]${message}`;
}

export interface PrettyOptionsExtended extends PrettyOptions {
  prettyStamp: boolean;
}
let LEVEL_VALUE_MAX = 0;
// eslint-disable-next-line guard-for-in
for (const l in levelsColors) {
  LEVEL_VALUE_MAX = Math.max(LEVEL_VALUE_MAX, l.length);
}

const ERROR_FLAG = '!';

export interface ObjectTemplate {
  level: LevelCode;
  msg: string;
  sub?: string;
  [key: string]: string | number | object | null | void;
}

export function fillInMsgTemplate(msg, templateOptions: ObjectTemplate, colors): string {
  const templateRegex = /@{(!?[$A-Za-z_][$0-9A-Za-z\._]*)}/g;

  return msg.replace(templateRegex, (_, name): string => {
    let str = templateOptions;
    let isError;
    if (name[0] === ERROR_FLAG) {
      name = name.substr(1);
      isError = true;
    }

    // object can be @{foo.bar.}
    const listAccessors = name.split('.');
    for (let property = 0; property < listAccessors.length; property++) {
      const id = listAccessors[property];
      if (isObject(str)) {
        str = (str as object)[id];
      }
    }

    if (typeof str === 'string') {
      if (colors === false || (str as string).includes('\n')) {
        return str;
      } else if (isError) {
        return red(str);
      }
      return green(str);
    }

    // object, showHidden, depth, colors
    return inspect(str, undefined, null, colors);
  });
}

function getMessage(debugLevel, msg, sub, templateObjects, hasColors) {
  const finalMessage = fillInMsgTemplate(msg, templateObjects, hasColors);

  const subSystemType = subSystemLevels.color[sub ?? 'default'];
  if (hasColors) {
    const logString = `${levelsColors[debugLevel](padRight(debugLevel, LEVEL_VALUE_MAX))}${white(`${subSystemType} ${finalMessage}`)}`;

    return padLeft(logString);
  }
  const logString = `${padRight(debugLevel, LEVEL_VALUE_MAX)}${subSystemType} ${finalMessage}`;

  return padRight(logString);
}

export function printMessage(templateObjects: ObjectTemplate, options: PrettyOptionsExtended, hasColors = true): string {
  const { prettyStamp } = options;
  const { level, msg, sub } = templateObjects;
  const debugLevel = calculateLevel(level);
  const logMessage = getMessage(debugLevel, msg, sub, templateObjects, hasColors);

  return prettyStamp ? formatLoggingDate(templateObjects.time as number, logMessage) : logMessage;
}
