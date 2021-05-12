/* eslint-disable no-console */
import path from 'path';
import { parseConfigFile } from '@verdaccio/config';
import server from '../src/index';

(async () => {
  try {
    const configFile = path.join(__dirname, './fastify-conf.yaml');
    console.log('configFile', configFile);
    const configParsed = parseConfigFile(configFile);
    console.log('--configParsed', configParsed);
    process.title = 'fastify-verdaccio';
    const ser = await server();
    await ser.listen(4000);
    console.log('fastify running on port 4000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
