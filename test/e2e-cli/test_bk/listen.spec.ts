import buildDebug from 'debug';
import { initialSetup } from '../utils/registry';
import { callRegistry } from '../utils/web';

const debug = buildDebug('verdaccio:e2e:test:listen');

describe('install a package', () => {
  jest.setTimeout(90000);
  const port = '9012';
  let registryProcess;
  // @ts-ignore
  const tempRootFolder = global.__namespace.getItem('dir-root');

  beforeAll(async () => {
    registryProcess = await initialSetup(tempRootFolder, port);
  });

  test('should match the listing port and load metadata', async () => {
    const body = await callRegistry(`http://localhost:${port}/verdaccio`);
    const parsedBody = JSON.parse(body);

    expect(parsedBody.name).toEqual('verdaccio');
  });

  afterAll(async () => {
    registryProcess.kill();
  });
});
