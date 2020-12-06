import { initialSetup } from '../utils/registry';
import { npm, pnpm, yarn } from '../utils/process';

describe('install a package', () => {
  jest.setTimeout(90000);
  const port = '9010';
  let registryProcess;
  // @ts-ignore
  const tempRootFolder = global.__namespace.getItem('dir-root');

  beforeAll(async () => {
    registryProcess = await initialSetup(tempRootFolder, port);
  });

  test('should run npm info json body', async () => {
    const resp = await npm('info', 'verdaccio', '--json');
    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.name).toEqual('verdaccio');
    expect(parsedBody.dependencies).toBeDefined();
  });

  test('should run yarn classic info json body', async () => {
    const resp = await yarn('info', 'verdaccio', '--json');
    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.data.name).toEqual('verdaccio');
    expect(parsedBody.data.dependencies).toBeDefined();
  });

  test('should run pnpm info json body', async () => {
    const resp = await pnpm('info', 'verdaccio', '--json');
    const parsedBody = JSON.parse(resp.stdout as string);
    expect(parsedBody.name).toEqual('verdaccio');
    expect(parsedBody.dependencies).toBeDefined();
  });

  afterAll(async () => {
    registryProcess.kill();
  });
});
