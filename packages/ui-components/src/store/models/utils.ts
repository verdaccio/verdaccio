export const HEADERS = {
  JSON: 'application/json',
};

export function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}
