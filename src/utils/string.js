// @flow

export function spliceURL(...args: Array<string>): string {
  return Array.from(args).reduce((lastResult, current) => lastResult + current).replace(/([^:])(\/)+(.)/g, `$1/$3`);
}
