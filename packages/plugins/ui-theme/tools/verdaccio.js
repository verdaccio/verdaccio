const fs = require('fs');
const path = require('path');

const { startVerdaccio } = require('@verdaccio/node-api');
const yalm = require('js-yaml');

const storageLocation = path.join(__dirname, '../partials/storage');
const pluginsLocation = path.join(__dirname, '../partials/plugins');
const configJsonFormat = Object.assign(
  {},
  yalm.safeLoad(fs.readFileSync('./tools/_verdaccio.config.yaml', 'utf8')),
  {
    storage: storageLocation,
    plugins: pluginsLocation,
  }
);

const serverHandler = function (webServer, addr, pkgName, pkgVersion) {
  webServer.listen(addr.port || addr.path, addr.host, () => {
    console.log(`${pkgName}:${pkgVersion} running ${addr.proto}://${addr.host}:${addr.port}`);
  });

  process.on('SIGTERM', () => {
    webServer.close(() => {
      console.log('verdaccio server has been shutdown');
    });
  });
};

// https://verdaccio.org/docs/en/node-api
startVerdaccio(configJsonFormat, 8080, '', '1.0.0', 'verdaccio', serverHandler);
