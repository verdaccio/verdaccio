import { Cli } from 'clipanion';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { InfoCommand } from '../../../../src/lib/cli/commands/info';
import { VersionCommand } from '../../../../src/lib/cli/commands/version';

vi.mock('envinfo', () => ({
  default: {
    run: vi.fn().mockResolvedValue('\n  OS: macOS 14.0\n  CPU: Apple M1\n'),
  },
}));

vi.mock('@verdaccio/config', () => ({
  findConfigFile: vi.fn(),
}));

vi.mock('../../../../src/lib/bootstrap', () => ({
  startVerdaccio: vi.fn(),
  listenDefaultCallback: vi.fn(),
}));

vi.mock('../../../../src/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    fatal: vi.fn(),
    logger: { fatal: vi.fn() },
  },
}));

vi.mock('../../../../src/lib/utils', () => ({
  parseConfigFile: vi.fn(),
}));

describe('VersionCommand', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should be registered with --version and -v paths', () => {
    expect(VersionCommand.paths).toEqual([['--version'], ['-v']]);
  });

  test('should output version prefixed with v', async () => {
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const cli = new Cli();
    cli.register(VersionCommand);
    const output: string[] = [];
    await cli.run(['--version'], {
      ...Cli.defaultContext,
      stdout: { write: (data: string) => output.push(data) } as any,
    });
    expect(output.join('')).toMatch(/^v.+\n$/);
  });

  test('should output dev when PACKAGE_VERSION is not set', async () => {
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const cli = new Cli();
    cli.register(VersionCommand);
    const output: string[] = [];
    await cli.run(['--version'], {
      ...Cli.defaultContext,
      stdout: { write: (data: string) => output.push(data) } as any,
    });
    expect(output.join('')).toContain('dev');
  });

  test('should call process.exit(0)', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const cli = new Cli();
    cli.register(VersionCommand);
    await cli.run(['--version'], {
      ...Cli.defaultContext,
      stdout: { write: vi.fn() } as any,
    });
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test('should work with -v alias', async () => {
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const cli = new Cli();
    cli.register(VersionCommand);
    const output: string[] = [];
    await cli.run(['-v'], {
      ...Cli.defaultContext,
      stdout: { write: (data: string) => output.push(data) } as any,
    });
    expect(output.join('')).toMatch(/^v/);
  });
});

describe('InfoCommand', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should be registered with --info and -i paths', () => {
    expect(InfoCommand.paths).toEqual([['--info'], ['-i']]);
  });

  test('should write environment info header', async () => {
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const cli = new Cli();
    cli.register(InfoCommand);
    const output: string[] = [];
    await cli.run(['--info'], {
      ...Cli.defaultContext,
      stdout: { write: (data: string) => output.push(data) } as any,
    });
    expect(output[0]).toBe('\nEnvironment Info:');
  });

  test('should call envinfo.run with correct categories', async () => {
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const envinfo = await import('envinfo');
    const cli = new Cli();
    cli.register(InfoCommand);
    await cli.run(['--info'], {
      ...Cli.defaultContext,
      stdout: { write: vi.fn() } as any,
    });
    expect(envinfo.default.run).toHaveBeenCalledWith({
      System: ['OS', 'CPU'],
      Binaries: ['node', 'yarn', 'npm', 'pnpm'],
      Virtualization: ['Docker'],
      Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
      npmGlobalPackages: ['verdaccio'],
    });
  });

  test('should write envinfo output to stdout', async () => {
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const envinfo = await import('envinfo');
    vi.mocked(envinfo.default.run).mockResolvedValue(
      '\n  OS: macOS 14.0\n  CPU: Apple M1\n'
    );
    const cli = new Cli();
    cli.register(InfoCommand);
    const output: string[] = [];
    await cli.run(['--info'], {
      ...Cli.defaultContext,
      stdout: { write: (data: string) => output.push(data) } as any,
    });
    const fullOutput = output.join('');
    expect(fullOutput).toContain('Environment Info:');
    expect(fullOutput).toContain('OS: macOS');
  });

  test('should call process.exit(0)', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const cli = new Cli();
    cli.register(InfoCommand);
    await cli.run(['--info'], {
      ...Cli.defaultContext,
      stdout: { write: vi.fn() } as any,
    });
    expect(exitSpy).toHaveBeenCalledWith(0);
  });

  test('should work with -i alias', async () => {
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const cli = new Cli();
    cli.register(InfoCommand);
    const output: string[] = [];
    await cli.run(['-i'], {
      ...Cli.defaultContext,
      stdout: { write: (data: string) => output.push(data) } as any,
    });
    expect(output[0]).toBe('\nEnvironment Info:');
  });
});

describe('InitCommand', () => {
  let findConfigFile: any;
  let parseConfigFile: any;
  let startVerdaccio: any;
  let listenDefaultCallback: any;
  let InitCommand: any;
  let DEFAULT_PROCESS_NAME: string;

  beforeEach(async () => {
    vi.restoreAllMocks();
    const configMod = await import('@verdaccio/config');
    findConfigFile = vi.mocked(configMod.findConfigFile);
    const utilsMod = await import('../../../../src/lib/utils');
    parseConfigFile = vi.mocked(utilsMod.parseConfigFile);
    const bootstrapMod = await import('../../../../src/lib/bootstrap');
    startVerdaccio = vi.mocked(bootstrapMod.startVerdaccio);
    listenDefaultCallback = bootstrapMod.listenDefaultCallback;
    const initMod = await import('../../../../src/lib/cli/commands/init');
    InitCommand = initMod.InitCommand;
    DEFAULT_PROCESS_NAME = initMod.DEFAULT_PROCESS_NAME;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should be the default command', () => {
    expect(InitCommand.paths).toEqual([[]]);
  });

  test('should have listen and config options', () => {
    const command = new InitCommand();
    expect(command).toHaveProperty('listen');
    expect(command).toHaveProperty('config');
  });

  test('should have usage with description and examples', () => {
    expect(InitCommand.usage).toBeDefined();
    expect(InitCommand.usage.description).toBe('launch the server');
    expect(InitCommand.usage.examples).toHaveLength(3);
  });

  test('should export DEFAULT_PROCESS_NAME as verdaccio', () => {
    expect(DEFAULT_PROCESS_NAME).toBe('verdaccio');
  });

  test('should find config, parse it, and start verdaccio', async () => {
    const configPath = '/home/user/.config/verdaccio/config.yaml';
    findConfigFile.mockReturnValue(configPath);
    parseConfigFile.mockReturnValue({
      self_path: configPath,
      https: { enable: false },
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    expect(findConfigFile).toHaveBeenCalled();
    expect(parseConfigFile).toHaveBeenCalledWith(configPath);
    expect(startVerdaccio).toHaveBeenCalledWith(
      expect.objectContaining({ self_path: configPath }),
      undefined,
      configPath,
      'dev',
      'verdaccio',
      listenDefaultCallback
    );
  });

  test('should set self_path and configPath when not present in parsed config', async () => {
    const configPath = '/home/user/config.yaml';
    findConfigFile.mockReturnValue(configPath);
    parseConfigFile.mockReturnValue({});

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    const parsedConfig = startVerdaccio.mock.calls[0][0];
    expect(parsedConfig.self_path).toBeDefined();
    expect(parsedConfig.configPath).toBe(parsedConfig.self_path);
  });

  test('should set https to disabled when not present in parsed config', async () => {
    findConfigFile.mockReturnValue('/config.yaml');
    parseConfigFile.mockReturnValue({ self_path: '/config.yaml' });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    const parsedConfig = startVerdaccio.mock.calls[0][0];
    expect(parsedConfig.https).toEqual({ enable: false });
  });

  test('should preserve existing https config', async () => {
    findConfigFile.mockReturnValue('/config.yaml');
    parseConfigFile.mockReturnValue({
      self_path: '/config.yaml',
      https: { enable: true, key: '/key.pem', cert: '/cert.pem' },
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    const parsedConfig = startVerdaccio.mock.calls[0][0];
    expect(parsedConfig.https).toEqual({
      enable: true,
      key: '/key.pem',
      cert: '/cert.pem',
    });
  });

  test('should set process.title from web.title config', async () => {
    findConfigFile.mockReturnValue('/config.yaml');
    parseConfigFile.mockReturnValue({
      self_path: '/config.yaml',
      https: { enable: false },
      web: { title: 'My Private Registry' },
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    expect(process.title).toBe('My Private Registry');
  });

  test('should set process.title to verdaccio when web.title is not set', async () => {
    findConfigFile.mockReturnValue('/config.yaml');
    parseConfigFile.mockReturnValue({
      self_path: '/config.yaml',
      https: { enable: false },
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    expect(process.title).toBe('verdaccio');
  });

  test('should pass --listen value to startVerdaccio', async () => {
    findConfigFile.mockReturnValue('/config.yaml');
    parseConfigFile.mockReturnValue({
      self_path: '/config.yaml',
      https: { enable: false },
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run(['--listen', '5000'], Cli.defaultContext);

    expect(startVerdaccio.mock.calls[0][1]).toBe('5000');
  });

  test('should pass --config value to findConfigFile', async () => {
    findConfigFile.mockReturnValue('/custom/config.yaml');
    parseConfigFile.mockReturnValue({
      self_path: '/custom/config.yaml',
      https: { enable: false },
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run(['--config', '/custom/config.yaml'], Cli.defaultContext);

    expect(findConfigFile).toHaveBeenCalledWith('/custom/config.yaml');
  });

  test('should call process.exit(1) when config file cannot be found', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    findConfigFile.mockImplementation(() => {
      throw new Error('config not found');
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('should call process.exit(1) when config file cannot be parsed', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    findConfigFile.mockReturnValue('/config.yaml');
    parseConfigFile.mockImplementation(() => {
      throw new Error('invalid YAML');
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  test('should log error message to console.error on failure', async () => {
    vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    findConfigFile.mockReturnValue('/bad/config.yaml');
    parseConfigFile.mockImplementation(() => {
      throw new Error('parse error');
    });

    const cli = new Cli();
    cli.register(InitCommand);
    await cli.run([], Cli.defaultContext);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('cannot open config file')
    );
  });
});

describe('CLI registration', () => {
  test('should register all commands without errors', async () => {
    const { InitCommand } = await import('../../../../src/lib/cli/commands/init');
    const cli = new Cli({
      binaryLabel: 'verdaccio',
      binaryName: 'node verdaccio',
      binaryVersion: '1.0.0-test',
    });

    expect(() => {
      cli.register(InfoCommand);
      cli.register(InitCommand);
      cli.register(VersionCommand);
    }).not.toThrow();
  });
});
