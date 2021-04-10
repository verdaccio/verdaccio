import { Config } from '@verdaccio/types';

const config: Config = {
  user_agent: 'string',
  server_id: 1234,
  secret: '12345',
  config_path: './nowhere',
  uplinks: {
    npmjs: {
      url: 'https://registry.npmjs.org/',
    },
  },
  security: {
    web: {
      sign: {},
      verify: {},
    },
    api: {
      legacy: true,
    },
  },
  packages: {
    test: {
      storage: '',
      publish: [''],
      proxy: [''],
      access: [''],
    },
  },
  web: {
    enable: true,
    title: 'string',
    logo: 'string',
  },
  logs: [],
  auth: {},
  notifications: {
    method: '',
    packagePattern: /a/,
    packagePatternFlags: '',
    headers: {},
    endpoint: '',
    content: '',
  },
  checkSecretKey: () => '1234',
  getMatchedPackagesSpec: jest.fn(),
  hasProxyTo: () => false,
};

export default config;
