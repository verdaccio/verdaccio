export function hasKeys(object?: Record<string, unknown>): boolean {
  return !!object && Object.keys(object).length > 0;
}
