import buildDebug from 'debug';
import NodeEnvironment from 'jest-environment-node';
import { createTempFolder } from '../utils/utils';
import * as __global from '../utils/global';

const debug = buildDebug('verdaccio:e2e:env');

class E2ECliTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  public async setup() {
    // create an unique suite location peer test to avoid conflicts
    const tempRoot = createTempFolder('verdaccio-suite-test-');
    debug('suite temporary folder %o', tempRoot);
    __global.addItem('dir-suite-root', tempRoot);
    // @ts-ignore
    this.global.__namespace = __global;
    debug(`current directory: ${process.cwd()}`);
  }

  public runScript(script): any {
    // @ts-expect-error
    return super.runScript(script);
  }
}

export default E2ECliTestEnvironment;
