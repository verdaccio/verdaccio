import { ConfigBuilder } from '@verdaccio/config';
import type { AuthConf, LoggerConfigItem, PackageAccessYaml } from '@verdaccio/types';

const builder = new ConfigBuilder();

// Set storage
builder.addStorage('./mock-store');

// Set web options (direct assignment since no builder method)
const config = builder.getConfig();
config.web = {
  enable: false,
  title: 'verdaccio-server-unit-test',
};

// Set auth
const auth: Partial<AuthConf> = {
  'auth-memory': {
    users: {
      test: {
        name: 'test',
        password: 'test',
      },
    },
  },
};
builder.addAuth(auth);

// Add logger
const logger: LoggerConfigItem = {
  type: 'stdout',
  format: 'pretty',
  level: 'trace',
};
builder.addLogger(logger);

// Add package access
const publicAccess: PackageAccessYaml = {
  access: '$all',
  publish: 'none',
};

builder.addPackageAccess('@*/*', publicAccess);
builder.addPackageAccess('**', publicAccess);

// Add debug flag manually
builder.getConfig()._debug = true;

// Done – final config
const finalConfig = builder.getConfig();

// Optional: export as YAML string
const yamlString = builder.getAsYaml();

export { finalConfig, yamlString };
