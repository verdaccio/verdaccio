import { LicenseInterface } from '../../types/packageMeta';

/**
 * Formats license field for webui.
 * @see https://docs.npmjs.com/files/package.json#license
 */
// License should use type License defined above, but conflicts with the unit test that provide array or empty object
export function formatLicense(license: string | LicenseInterface): string | undefined {
  if (typeof license === 'string') {
    return license;
  }

  if (license?.type) {
    return license.type;
  }

  return;
}

export function fileSizeSI(
  a: number,
  b?: typeof Math,
  c?: (p: number) => number,
  d?: number,
  e?: number
): string {
  return (
    ((b = Math), (c = b.log), (d = 1e3), (e = (c(a) / c(d)) | 0), a / b.pow(d, e)).toFixed(2) +
    ' ' +
    (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes')
  );
}
