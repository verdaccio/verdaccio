
import {fillInMsgTemplate} from "../formatter";

const Logger = require('bunyan');

export function jsonFormat(obj, hasColors): string {
    const msg = fillInMsgTemplate(obj.msg, obj, hasColors);

    return `${JSON.stringify({ ...obj, msg }, Logger.safeCycles())}\n`;
}
