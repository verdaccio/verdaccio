import { Manifest } from '@verdaccio/types';

export function stringifyPackage(manifest: Manifest): string {
  return JSON.stringify(manifest, null, '\t');
}

export function parsePackage(json: string): Manifest {
  return JSON.parse(json);
}
