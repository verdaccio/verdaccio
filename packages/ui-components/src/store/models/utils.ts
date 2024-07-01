export function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}
