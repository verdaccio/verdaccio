/**
 * PLEASE DO NOT MODIFY THIS FILE
 *
 * This test is just for teaching purpose, use this example as template for your new endpoint API unit test
 *
 * If you have any questions, ask at the http://chat.verdaccio.org #questions channel.
 *
 */
import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import endPointAPI from '@verdaccio/server';
import { mockServer } from '../../__helper/mock';
import { DOMAIN_SERVERS } from '../../../functional/config.functional';
import { parseConfigFile } from '@verdaccio/utils/src/utils';
import { parseConfigurationFile } from '../../__helper';
import { addUser } from '../../__helper/api';
import { setup } from '@verdaccio/logger';

// we must start logging without output
setup([]);

const parseConfigurationJWTFile = () => {
  // Any new test must have a custom yaml file, try to name it based on the feature, the config
  // file does not need to include all configuration, just the part is needs
  // eg: test/unit/partials/config/yaml/api-jwt/jwt.yaml
  return parseConfigurationFile(`api-jwt/jwt`);
};

describe('endpoint example unit test', () => {
  let app;
  let mockRegistry;

  beforeAll(function (done) {
    // 1. We create a route for a custom storage folder for this test
    const store = path.join(__dirname, '../../partials/store/test-template-storage');
    // 2. The port must be unique (at this point this is not automated, need to be checked manually)
    const mockServerPort = 55546;
    // 3. Use rimraf to clean the state each time you run the test
    rimraf(store, async () => {
      // 4. Use a custom configuration file
      const confS = parseConfigFile(parseConfigurationJWTFile());
      // 5. Customise specific properties
      const configForTest = _.assign({}, _.cloneDeep(confS), {
        storage: store,
        uplinks: {
          npmjs: {
            url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
          },
        },
        // 6. The self_path is important be the same as the store
        self_path: store,
        // 7. Define the location of the .htpasswd file, this is relative to self_path.
        auth: {
          htpasswd: {
            file: './test-jwt-storage/.htpasswd',
          },
        },
      });

      // 8. Use the helper `endPointAPI` to mock the API
      app = await endPointAPI(configForTest);
      // 9 . Use `mockServer` to mock launch the server.
      mockRegistry = await mockServer(mockServerPort).init();
      done();
    });
  });

  afterAll(function (done) {
    // 10. Do not forget to stop the API, or it will run forever.
    mockRegistry[0].stop();
    done();
  });

  test('should test add a new user with JWT enabled', async (done) => {
    // At this point the server is running and you can run the test

    const credentials = { name: 'JotaJWT', password: 'secretPass' };
    // 11. Use helpers for repetitive tasks
    // @ts-ignore
    const [err, res] = await addUser(request(app), credentials.name, credentials);

    // 12. test your output
    expect(err).toBeNull();
    expect(res.body.ok).toBeDefined();
    expect(res.body.token).toBeDefined();

    // 13. end the async test
    done();
  });
});
