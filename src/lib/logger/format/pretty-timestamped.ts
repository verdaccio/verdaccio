import {formatLoggingDate} from "../utils";
import {printMessage} from "../formatter";

export function prettyTimestamped(obj, hasColors): string {
    return `[${formatLoggingDate(obj.time)}] ${printMessage(obj.level, obj.msg, obj, hasColors)}\n`;
}
