import path from 'path';
import buildDebug from 'debug';
import { parseConfigFile } from '@verdaccio/config';
import { setup, logger } from '@verdaccio/logger';
import server from '../src/index';

const debug = buildDebug('verdaccio:fastify:debug');

(async () => {
  try {
    const configFile = path.join(__dirname, './fastify-conf.yaml');
    debug('configFile %s', configFile);
    const configParsed = parseConfigFile(configFile);
    setup(configParsed.log);
    logger.info(`config location ${configFile}`);
    debug('configParsed %s', configParsed);
    process.title = 'fastify-verdaccio';
    const ser = await server();
    await ser.listen(4000);
    logger.info('fastify running on port 4000');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
})();
