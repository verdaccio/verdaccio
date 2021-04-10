import { initialSetup } from '../utils/registry';
import { callRegistry } from '../utils/web';

describe('install a package', () => {
  jest.setTimeout(90000);
  const port = '9012';
  let registryProcess;

  beforeAll(async () => {
    registryProcess = await initialSetup(port);
  });

  test('should match the listing port and load metadata', async () => {
    const body = await callRegistry(`http://localhost:${port}/verdaccio`);
    const parsedBody = JSON.parse(body);

    expect(parsedBody.name).toEqual('verdaccio');
  });

  afterAll(async () => {
    registryProcess.child.kill();
  });
});
