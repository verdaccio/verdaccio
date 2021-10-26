export function isNil(value: any): boolean {
  return value === null || typeof value === 'undefined';
}

export function isFunction(value): boolean {
  return typeof value === 'function';
}
