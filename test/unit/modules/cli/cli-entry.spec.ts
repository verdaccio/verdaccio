import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Mock clipanion before importing cli.ts
const mockRegister = vi.fn();
const mockRunExit = vi.fn();
vi.mock('clipanion', () => {
  return {
    Cli: vi.fn().mockImplementation(() => ({
      register: mockRegister,
      runExit: mockRunExit,
    })),
  };
});

// Mock commands to avoid their side effects
vi.mock('../../../../src/lib/cli/commands/info', () => ({
  InfoCommand: class InfoCommand {},
}));
vi.mock('../../../../src/lib/cli/commands/init', () => ({
  InitCommand: class InitCommand {},
}));
vi.mock('../../../../src/lib/cli/commands/version', () => ({
  VersionCommand: class VersionCommand {},
}));

// Mock utils — use a variable so we can control it per test
let mockIsVersionValid = true;
vi.mock('../../../../src/lib/cli/utils', () => ({
  MIN_NODE_VERSION: '18',
  isVersionValid: vi.fn(() => mockIsVersionValid),
}));

describe('cli.ts entry point', () => {
  const originalGetuid = process.getuid;
  const originalEmitWarning = process.emitWarning;
  const originalArgv = process.argv;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    mockRegister.mockClear();
    mockRunExit.mockClear();
    mockIsVersionValid = true;
    process.argv = ['/usr/bin/node', '/usr/bin/verdaccio', '--version'];
  });

  afterEach(() => {
    process.getuid = originalGetuid;
    process.emitWarning = originalEmitWarning;
    process.argv = originalArgv;
    process.env = { ...originalEnv };
  });

  test('should emit warning when running as root (uid 0)', async () => {
    const emitWarningSpy = vi.fn();
    process.emitWarning = emitWarningSpy;
    process.getuid = () => 0;

    await import('../../../../src/lib/cli/cli');

    expect(emitWarningSpy).toHaveBeenCalledWith(
      expect.stringContaining("doesn't need superuser privileges")
    );
  });

  test('should not emit warning when not running as root', async () => {
    const emitWarningSpy = vi.fn();
    process.emitWarning = emitWarningSpy;
    process.getuid = () => 1000;

    await import('../../../../src/lib/cli/cli');

    expect(emitWarningSpy).not.toHaveBeenCalled();
  });

  test('should not emit warning when getuid is not available', async () => {
    const emitWarningSpy = vi.fn();
    process.emitWarning = emitWarningSpy;
    // On Windows, getuid doesn't exist
    // @ts-expect-error - simulating Windows
    process.getuid = undefined;

    await import('../../../../src/lib/cli/cli');

    expect(emitWarningSpy).not.toHaveBeenCalled();
  });

  test('should throw error when Node version is invalid', async () => {
    mockIsVersionValid = false;

    await expect(() => import('../../../../src/lib/cli/cli')).rejects.toThrow(
      /Verdaccio requires at least Node\.js/
    );
  });

  test('should create Cli with correct binary metadata', async () => {
    const { Cli } = await import('clipanion');

    await import('../../../../src/lib/cli/cli');

    expect(Cli).toHaveBeenCalledWith(
      expect.objectContaining({
        binaryLabel: 'verdaccio',
        binaryVersion: expect.any(String),
      })
    );
  });

  test('should use PACKAGE_VERSION env var when set', async () => {
    process.env.PACKAGE_VERSION = '7.0.0-beta.1';
    const { Cli } = await import('clipanion');

    await import('../../../../src/lib/cli/cli');

    expect(Cli).toHaveBeenCalledWith(
      expect.objectContaining({
        binaryVersion: '7.0.0-beta.1',
      })
    );
  });

  test('should fall back to dev when PACKAGE_VERSION is not set', async () => {
    delete process.env.PACKAGE_VERSION;
    const { Cli } = await import('clipanion');

    await import('../../../../src/lib/cli/cli');

    expect(Cli).toHaveBeenCalledWith(
      expect.objectContaining({
        binaryVersion: 'dev',
      })
    );
  });

  test('should register all three commands', async () => {
    await import('../../../../src/lib/cli/cli');

    expect(mockRegister).toHaveBeenCalledTimes(3);
  });

  test('should call runExit with parsed args', async () => {
    process.argv = ['/usr/bin/node', '/usr/bin/verdaccio', '--info'];

    await import('../../../../src/lib/cli/cli');

    expect(mockRunExit).toHaveBeenCalledTimes(1);
    expect(mockRunExit.mock.calls[0][0]).toEqual(['--info']);
  });
});
