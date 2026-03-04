import { Range } from 'semver';

export function jsonLogReplacer(_key: string, value: unknown) {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }

  if (value instanceof Range) {
    return value.range;
  }

  return value;
}
