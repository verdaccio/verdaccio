// import getPort from 'get-port';
import { addRegistry, initialSetup } from '../utils/registry';
import { npm } from '../utils/process';
// import { SETUP_VERDACCIO_PORT } from '../utils/utils';

describe('search a package', () => {
  const port = 9014;
  let registryProcess;

  beforeAll(async () => {
    // await waitOnRegistry(SETUP_VERDACCIO_PORT);
    // const availablePort = await getPort({ port });
    registryProcess = await initialSetup(port);
  });

  test('should run npm search on v1', async () => {
    // await waitOnRegistry(port);
    const resp = await npm('search', 'verdaccio-memory', '--json', ...addRegistry(port));
    const { stdout } = resp;
    const response = JSON.parse(stdout);
    // console.log('r', response);
    expect(Array.isArray(response)).toBeTruthy();
  }, 90000);

  afterAll(async () => {
    registryProcess.child.kill();
  });
});
