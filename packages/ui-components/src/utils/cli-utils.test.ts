import type { SyntheticEvent } from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  copyToClipBoardUtility,
  getBunfigRegistry,
  getCLISetConfigRegistry,
  getMinReleaseAgeConfig,
} from './cli-utils';

describe('copyToClipBoardUtility', () => {
  let originalGetSelection: typeof window.getSelection;

  const mockGetSelectionResult = {
    removeAllRanges: vi.fn(),
    addRange: vi.fn(),
  };
  beforeEach(() => {
    originalGetSelection = window.getSelection;

    window.getSelection = vi.fn().mockReturnValue(mockGetSelectionResult);
  });
  afterEach(() => {
    window.getSelection = originalGetSelection;
    vi.restoreAllMocks();
  });

  test('should call the DOM APIs', () => {
    // Given
    const testEvent: { preventDefault: Function } = {
      preventDefault: vi.fn(),
    };
    const testCopy = 'copy text';
    const spys = {
      createElement: vi.spyOn(document, 'createElement'),
      execCommand: vi.spyOn(document, 'execCommand'),
      appendChild: vi.spyOn(document.body, 'appendChild'),
      removeChild: vi.spyOn(document.body, 'removeChild'),
    };
    const expectedDiv = document.createElement('div');
    expectedDiv.innerText = testCopy;

    // When
    const copyFunc = copyToClipBoardUtility(testCopy);
    copyFunc(testEvent as SyntheticEvent<HTMLElement>);

    // Then
    expect(mockGetSelectionResult.removeAllRanges).toHaveBeenCalledWith();
    expect(mockGetSelectionResult.addRange).toHaveBeenCalled();
    expect(spys.createElement).toHaveBeenCalledWith('div');
    expect(spys.appendChild).toHaveBeenCalledWith(expectedDiv);
    expect(spys.execCommand).toHaveBeenCalledWith('copy');
    expect(spys.removeChild).toHaveBeenCalledWith(expectedDiv);
  });
});

describe('getCLISetRegistry', () => {
  const command = 'npm set';
  const scope = '@testscope';
  const blankScope = '';
  const url = 'https://test.local';

  test('should return ":" separated string when scope is set', () => {
    expect(getCLISetConfigRegistry(command, scope, url)).toEqual(
      `${command} ${scope}:registry ${url}`
    );
  });

  test('should not output scope when scope is not set', () => {
    expect(getCLISetConfigRegistry(command, blankScope, url)).toEqual(`${command} registry ${url}`);
  });
});

describe('getBunfigRegistry', () => {
  const url = 'http://localhost:4873/';

  test('sets the default registry of bun install', () => {
    expect(getBunfigRegistry(undefined, url)).toEqual(
      `# bunfig.toml\n[install]\nregistry = "${url}"`
    );
  });

  test('sets only the scope when a scope is given', () => {
    expect(getBunfigRegistry('@verdaccio', url)).toEqual(
      `# bunfig.toml\n[install.scopes]\n"@verdaccio" = "${url}"`
    );
  });
});

describe('getMinReleaseAgeConfig', () => {
  test('writes days for npm and exempts the scope', () => {
    expect(getMinReleaseAgeConfig('npm', '@verdaccio', 3)).toEqual(
      '# .npmrc\nmin-release-age=3\nmin-release-age-exclude[]=@verdaccio/*'
    );
  });

  test('writes minutes for pnpm', () => {
    expect(getMinReleaseAgeConfig('pnpm', '@verdaccio', 3)).toEqual(
      "# pnpm-workspace.yaml\nminimumReleaseAge: 4320\nminimumReleaseAgeExclude:\n  - '@verdaccio/*'"
    );
  });

  test('gives the scope its own gate for yarn', () => {
    expect(getMinReleaseAgeConfig('yarn', '@verdaccio', 3)).toEqual(
      '# .yarnrc.yml\nnpmMinimalAgeGate: 3d\nnpmScopes:\n  verdaccio:\n    npmMinimalAgeGate: 0'
    );
  });

  test('writes seconds for bun', () => {
    expect(getMinReleaseAgeConfig('bun', '@verdaccio', 3)).toEqual(
      '# bunfig.toml\n[install]\nminimumReleaseAge = 259200'
    );
  });

  test('returns nothing for an unknown client', () => {
    expect(getMinReleaseAgeConfig('deno', '@verdaccio')).toEqual('');
  });
});
