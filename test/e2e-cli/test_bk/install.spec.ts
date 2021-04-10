import semver from 'semver';
import { addNpmPrefix, addRegistry, addYarnPrefix, initialSetup, Setup } from '../utils/registry';
import { npm, pnpm, yarn, yarnWithCwd } from '../utils/process';
import { createProject } from '../utils/utils';

describe('install a package', () => {
  jest.setTimeout(90000);
  const port = '9011';
  let setup: Setup;

  beforeAll(async () => {
    setup = await initialSetup(port);
  });

  test('should run npm install', async () => {
    const projectFolder = createProject('webpack-npm-jest');
    const resp = await npm(
      'install',
      'jest',
      '--json',
      ...addNpmPrefix(projectFolder),
      ...addRegistry(port)
    );
    expect(resp.stderr).toBeUndefined();

    const resp2 = await npm('run', 'jest', '--version', ...addNpmPrefix(projectFolder));
    expect(semver.valid(resp2.stdout)).toBeTruthy();
  });

  test('should run pnpm install', async () => {
    const projectFolder = createProject('webpack-pnpm-test');
    const resp = await pnpm(
      'install',
      'jest@26.6.3',
      ...addNpmPrefix(projectFolder),
      ...addRegistry(port)
    );
    expect(resp.stderr).toBeUndefined();

    // TODO: verify package was correctly installed
  });

  test('should run yarn classic install', async () => {
    const projectFolder = createProject('jest-yarn-test');
    const resp = await yarn(
      'add',
      'jest@26.6.3',
      ...addYarnPrefix(projectFolder),
      ...addRegistry(port)
    );
    expect(resp.stderr).toBeUndefined();

    const resp2 = await yarnWithCwd(projectFolder, 'jest', '--version');
    // yarn output is to verbose
    expect(resp2.stdout).toMatch(/26.6.3/);
  });

  afterAll(async () => {
    setup.child.kill();
  });
});
