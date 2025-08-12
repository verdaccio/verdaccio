export const HEADERS = {
  JSON: 'application/json',
} as const;

export function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}
