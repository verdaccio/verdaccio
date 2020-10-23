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
    this.self_path = './src/___tests___/__fixtures__/config.yaml';
    this.https = {
      enable: false,
    };
    this.user_agent = 'verdaccio/3.0.0-alpha.7';
    this.users = {};
    this.server_id = 'severMockId';
    this.checkSecretKey = (secret): string => {
      if (!secret) {
        const newSecret = 'superNewSecret';
        this.secret = newSecret;

        return newSecret;
      }
      return secret;
    };
  }
}
