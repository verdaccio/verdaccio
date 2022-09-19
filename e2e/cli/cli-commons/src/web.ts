import got from 'got';

export function callRegistry(url: string): Promise<string> {
  return got.get(url, { headers: { Accept: 'application/json' } }).json();
}
