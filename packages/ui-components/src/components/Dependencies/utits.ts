export function hasKeys(object?: { [key: string]: any }): boolean {
  return !!object && Object.keys(object).length > 0;
}
