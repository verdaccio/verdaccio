import type { SyntheticEvent } from 'react';

export const copyToClipBoardUtility =
  (str: string): ((e: SyntheticEvent<HTMLElement>) => void) =>
  (event: SyntheticEvent<HTMLElement>): void => {
    event.preventDefault();

    const node = document.createElement('div');
    node.innerText = str;
    if (document.body) {
      document.body.appendChild(node);

      const range = document.createRange();
      const selection = window.getSelection() as Selection;
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      document.body.removeChild(node);
    }
  };

export function getCLISetConfigRegistry(
  command: string,
  scope: string | undefined,
  registryUrl: string
): string {
  // if there is a scope defined there needs to be a ":" separator between the scope and the registry
  return `${command} ${scope ? `${scope}:` : ''}registry ${registryUrl}`;
}

/** The `.npmrc` line that points the default registry, or only `scope`, at `registryUrl`. */
export function getNpmrcRegistry(scope: string | undefined, registryUrl: string): string {
  return scope ? `${scope}:registry=${registryUrl}` : `registry=${registryUrl}`;
}

/** The `bunfig.toml` section that points bun at `registryUrl`, for every package or only `scope`. */
export function getBunfigRegistry(scope: string | undefined, registryUrl: string): string {
  return scope
    ? `# bunfig.toml\n[install.scopes]\n"${scope}" = "${registryUrl}"`
    : `# bunfig.toml\n[install]\nregistry = "${registryUrl}"`;
}

export const MIN_RELEASE_AGE_DAYS = 3;

/**
 * The config that keeps a client from installing versions newer than `days`, with `scope` exempt
 * (yarn gives the scope its own gate instead), in the file and unit each client reads.
 */
export function getMinReleaseAgeConfig(
  manager: string,
  scope: string,
  days: number = MIN_RELEASE_AGE_DAYS
): string {
  switch (manager) {
    case 'npm':
      return `# .npmrc\nmin-release-age=${days}\nmin-release-age-exclude[]=${scope}/*`;
    case 'pnpm':
      return `# pnpm-workspace.yaml\nminimumReleaseAge: ${days * 24 * 60}\nminimumReleaseAgeExclude:\n  - '${scope}/*'`;
    case 'yarn':
      return `# .yarnrc.yml\nnpmMinimalAgeGate: ${days}d\nnpmScopes:\n  ${scope.replace('@', '')}:\n    npmMinimalAgeGate: 0`;
    case 'bun':
      return `# bunfig.toml\n[install]\nminimumReleaseAge = ${days * 24 * 60 * 60}`;
    default:
      return '';
  }
}

export function getCLISetRegistry(command: string, registryUrl: string): string {
  return `${command} --registry ${registryUrl}`;
}

export function getCLIChangePassword(command: string, registryUrl: string): string {
  return `${command} profile set password --registry ${registryUrl}`;
}

export function getCLISBerryYamlRegistry(scope: string | undefined, registryUrl: string): string {
  return !scope
    ? `# .yarnrc.yml
npmRegistryServer: "${registryUrl}"
unsafeHttpWhitelist:
  - ${new URL(registryUrl).host}`
    : `
# .yarnrc.yml
npmRegistryServer: "${registryUrl}"
npmScopes:
  ${scope.replace('@', '')}:
    npmRegistryServer: ${registryUrl}
    npmPublishRegistry: ${registryUrl}`;
}
