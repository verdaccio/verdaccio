import {printMessage} from "../formatter";

export function pretty(obj, hasColors): string {
    return `${printMessage(obj.level, obj.msg, obj, hasColors)}\n`;
}
