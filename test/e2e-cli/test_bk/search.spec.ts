import { addRegistry, initialSetup } from '../utils/registry';
import { npm } from '../utils/process';

describe('search a package', () => {
  jest.setTimeout(90000);
  const port = `9014`;
  let registryProcess;

  beforeAll(async () => {
    registryProcess = await initialSetup(port);
  });

  test('should run npm search on v1', async () => {
    // await waitOnRegistry(port);
    const resp = await npm('search', 'verdaccio-memory', '--json', ...addRegistry(port));
    const { stdout } = resp;
    const response = JSON.parse(stdout);
    expect(Array.isArray(response)).toBeTruthy();
  });

  afterAll(async () => {
    registryProcess.child.kill();
  });
});
