export type NormalizedSearchOption = {
  name: string;
  version?: string;
  description?: string;
  isPrivate: boolean;
  isCached: boolean;
  isRemote: boolean;
};

/**
 * Normalize a raw search result into a unified shape the UI can render,
 * regardless of which backend response format was returned:
 *
 * 1) npm-style "search objects" response where each entry is wrapped in
 *    `{ package: { name, version, description, ... }, verdaccioPrivate, verdaccioPkgCached }`.
 * 2) Flat packument-style response where each entry exposes `name`, `version`,
 *    `description`, `dist`, etc. directly at the top level.
 *
 * The second shape carries no uplink metadata, so private/remote/cached flags
 * default to `false` and the UI simply omits the corresponding badges.
 */
export function normalizeSearchOption(option: any): NormalizedSearchOption {
  if (option && typeof option === 'object' && option.package) {
    const pkg = option.package ?? {};
    const isPrivate = Boolean(option.verdaccioPrivate);
    const isCached = Boolean(option.verdaccioPkgCached);
    return {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      isPrivate,
      isCached,
      isRemote: !isCached && !isPrivate,
    };
  }

  const flat = option ?? {};
  return {
    name: flat.name,
    version: flat.version,
    description: flat.description,
    isPrivate: false,
    isCached: false,
    isRemote: false,
  };
}

function removeHtmlTags(input: string): string {
  let previous;
  do {
    previous = input;
    input = input.replace(/<[^>]*>?/gm, '');
  } while (input !== previous);
  return input;
}

export function cleanDescription(description: string): string {
  let output = description;
  // remove html tags from description (e.g. <h1...>)
  output = removeHtmlTags(output);
  // remove markdown links from description (e.g. [link](url))
  output = output.replace(/\(.*?\)/gm, '').replace(/(\[!?|\])/gm, '');
  return output;
}
