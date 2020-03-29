import { inspect } from 'util';

import { white, red, green } from 'kleur';
import {calculateLevel, levelsColors, subSystemLevels} from "./levels";

import { isObject, pad } from './utils';

let LEVEL_VALUE_MAX = 0;
for (const l in levelsColors) {
  if (Object.prototype.hasOwnProperty.call(levelsColors, l)) {
    LEVEL_VALUE_MAX = Math.max(LEVEL_VALUE_MAX, l.length);
  }
}

/**
 * Apply colors to a string based on level parameters.
 * @param {*} type
 * @param {*} msg
 * @param {*} templateObjects
 * @param {*} hasColors
 * @return {String}
 */
export function printMessage(type, msg, templateObjects, hasColors = true) {
  if (typeof type === 'number') {
    type = calculateLevel(type);
  }

  const finalMessage = fillInMsgTemplate(msg, templateObjects, hasColors);

  const sub = subSystemLevels.color[templateObjects.sub] || subSystemLevels.color.default;
  if (hasColors) {
    return ` ${levelsColors[type](pad(type, LEVEL_VALUE_MAX))}${white(`${sub} ${finalMessage}`)}`;
  }
  return ` ${pad(type, LEVEL_VALUE_MAX)}${sub} ${finalMessage}`;
}

export function fillInMsgTemplate(msg, obj: unknown, colors): string {
  return msg.replace(/@{(!?[$A-Za-z_][$0-9A-Za-z\._]*)}/g, (_, name): string => {

    let str = obj;
    let is_error;
    if (name[0] === '!') {
      name = name.substr(1);
      is_error = true;
    }

    const _ref = name.split('.');
    for (let _i = 0; _i < _ref.length; _i++) {
      const id = _ref[_i];
      if (isObject(str)) {
        // @ts-ignore
        str = str[id];
      } else {
        str = undefined;
      }
    }

    if (typeof str === 'string') {
      if (!colors || (str as string).includes('\n')) {
        return str;
      } else if (is_error) {
        return red(str);
      }
      return green(str);
    }
    return inspect(str, undefined, null, colors);
  });
}
