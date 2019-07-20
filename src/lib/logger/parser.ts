import { inspect } from 'util';
import { isObject } from '../utils';
import { red, green } from 'kleur';

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
      } else {
        return green(str);
      }
    } else {
      return inspect(str, undefined, null, colors);
    }
  });
}
