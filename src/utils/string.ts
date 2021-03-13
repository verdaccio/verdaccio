// @flow

export function spliceURL(...args: string[]): string {
  return Array.from(args)
    .reduce((lastResult, current) => lastResult + current)
    .replace(/([^:])(\/)+(.)/g, `$1/$3`);
}
