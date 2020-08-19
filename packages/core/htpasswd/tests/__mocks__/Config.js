export default class Config {
  constructor() {
    this.storage = './test-storage';
    this.listen = 'http://localhost:1443/';
    this.auth = {
      htpasswd: {
        file: './htpasswd',
        max_users: 1000,
      },
    };
    this.uplinks = {
      npmjs: {
        url: 'https://registry.npmjs.org',
        cache: true,
      },
    };
    this.packages = {
      '@*/*': {
        access: ['$all'],
        publish: ['$authenticated'],
        proxy: [],
      },
      '*': {
        access: ['$all'],
        publish: ['$authenticated'],
        proxy: ['npmjs'],
      },
      '**': {
        access: [],
        publish: [],
        proxy: [],
      },
    };
    this.logs = [
      {
        type: 'stdout',
        format: 'pretty',
        level: 35,
      },
    ];
    this.self_path = './tests/__fixtures__/config.yaml';
    this.https = {
      enable: false,
    };
    this.user_agent = 'verdaccio/3.0.0-alpha.7';
    this.users = {};
    this.server_id = '5cf430af30a1';
    this.secret = 'ebde3e3a2a789a0623bf3de58cd127f0b309f573686cc91dc6d0f8fc6214b542';
  }
}
