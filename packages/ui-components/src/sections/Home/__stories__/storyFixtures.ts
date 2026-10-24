/** Real package names used by the home stories. */
export const manifest = (
  name: string,
  version: string,
  description: string,
  time: string,
  keywords: string[] = []
) => ({
  name,
  version,
  description,
  time,
  keywords,
  license: 'MIT',
  author: { name: 'Verdaccio contributors' },
  dist: {
    // same shape as the tarball url the registry serves
    tarball: `http://localhost:4873/${name}/-/${name.split('/').pop()}-${version}.tgz`,
    unpackedSize: 40_000,
  },
});

export const registryPackages = [
  manifest(
    'verdaccio',
    '6.1.2',
    'A lightweight private npm proxy registry',
    '2026-10-01T10:00:00Z',
    ['private', 'registry']
  ),
  manifest(
    '@verdaccio/core',
    '8.0.0',
    'Core utilities shared by every Verdaccio package',
    '2026-10-20T08:00:00Z'
  ),
  manifest(
    '@verdaccio/config',
    '8.0.0',
    'Configuration parser and defaults',
    '2026-10-18T08:00:00Z'
  ),
  manifest(
    '@verdaccio/ui-components',
    '5.0.0',
    'React components of the Verdaccio web UI',
    '2026-10-22T08:00:00Z',
    ['react', 'ui']
  ),
  manifest('@types/node', '24.3.0', 'TypeScript definitions for Node.js', '2026-09-30T12:00:00Z', [
    'types',
  ]),
  manifest('jquery', '3.7.1', 'JavaScript library for DOM operations', '2026-08-28T12:00:00Z'),
  manifest('lodash', '4.17.21', 'Lodash modular utilities', '2026-07-15T12:00:00Z'),
];
