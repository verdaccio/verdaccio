import { inspect } from 'util';

import { white, red, green } from 'kleur';
import padLeft from 'pad-left';

import {calculateLevel, LevelCode, levelsColors, subSystemLevels} from "./levels";
import {formatLoggingDate, isObject, pad} from './utils';
import {PrettyOptionsExtended} from "./types";

let LEVEL_VALUE_MAX = 0;
for (const l in levelsColors) {
  LEVEL_VALUE_MAX = Math.max(LEVEL_VALUE_MAX, l.length);
}

const ERROR_FLAG = '!';

export interface ObjectTemplate {
  level: LevelCode;
  msg: string;
  sub?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: string | number | object | null | void;
};

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
        // eslint-disable-next-line @typescript-eslint/ban-types
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

const CUSTOM_PAD_LENGTH = 1;

function getMessage(debugLevel, msg, sub, templateObjects, hasColors) {
  const finalMessage = fillInMsgTemplate(msg, templateObjects, hasColors);

  const subSystemType = subSystemLevels.color[sub ?? 'default'];
  if (hasColors) {
    const logString = `${levelsColors[debugLevel](pad(debugLevel, LEVEL_VALUE_MAX))}${white(`${subSystemType} ${finalMessage}`)}`;

    return padLeft(logString, logString.length + CUSTOM_PAD_LENGTH , ' ');
  }
  const logString = `${pad(debugLevel, LEVEL_VALUE_MAX)}${subSystemType} ${finalMessage}`;

  return padLeft(logString, logString.length + CUSTOM_PAD_LENGTH , ' ');
}

export function printMessage(
    templateObjects: ObjectTemplate,
    options: PrettyOptionsExtended,
    hasColors = true): string {
  const { prettyStamp } = options;
  const { level, msg, sub } = templateObjects;
  const debugLevel = calculateLevel(level);
  const logMessage = getMessage(debugLevel, msg, sub, templateObjects, hasColors);

  return prettyStamp ? formatLoggingDate(templateObjects.time as number, logMessage) : logMessage;
}
