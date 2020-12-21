import buildDebug from 'debug';

const debug = buildDebug('verdaccio:e2e:teardown');

module.exports = async function () {
  debug('e2e teardown kill server');
  // @ts-ignore
  global.registryProcess.kill();
};
