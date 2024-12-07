import { SyntheticEvent } from 'react';
import { vi } from 'vitest';

import { copyToClipBoardUtility, getCLISetConfigRegistry } from './cli-utils';

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
