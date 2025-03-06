import { vi } from 'vitest';

export const mockCreateObjectURL = vi.fn();
export const mockRevokeObjectURL = vi.fn();

let originalUserAgent: string;

/**
 * Sets up mocks for URL and navigator.userAgent to handle download functionality in tests
 */
export function setupDownloadMocks(): void {
  originalUserAgent = window.navigator.userAgent;

  URL.createObjectURL = mockCreateObjectURL;
  URL.revokeObjectURL = mockRevokeObjectURL;

  Object.defineProperty(window.navigator, 'userAgent', {
    value: 'jsdom',
    configurable: true,
  });
}

/**
 * Cleans up mocks for URL and navigator.userAgent
 */
export function cleanupDownloadMocks(): void {
  mockCreateObjectURL.mockReset();
  mockRevokeObjectURL.mockReset();

  Object.defineProperty(window.navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: true,
  });
}
