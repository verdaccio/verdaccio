import { PackageMetaInterface } from '../../types/packageMeta';

import API from './api';

export async function callReadme(packageName: string, packageVersion?: string): Promise<string> {
  return await API.request<string>(
    `package/readme/${packageName}${packageVersion ? `?v=${packageVersion}` : ''}`,
    'GET'
  );
}

export async function callDetailPage(
  packageName: string,
  packageVersion?: string
): Promise<PackageMetaInterface> {
  const packageMeta = await API.request<PackageMetaInterface>(
    `sidebar/${packageName}${packageVersion ? `?v=${packageVersion}` : ''}`,
    'GET'
  );

  return packageMeta;
}

export function callSearch(value: string, signal: AbortSignal) {
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API#Browser_compatibility
  // FUTURE: signal is not well supported for IE and Samsung Browser
  return API.request(`search/${encodeURIComponent(value)}`, 'GET', { signal, headers: {} });
}
