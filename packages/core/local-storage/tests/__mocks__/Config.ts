import minimatch from 'minimatch';

// FUTURE: we should use the same is on verdaccio
export function getMatchedPackagesSpec(pkgName: string, packages: object): object | undefined {
  for (const i in packages) {
    if (minimatch.makeRe(i).exec(pkgName)) {
      return packages[i];
    }
  }
  return;
}

export default class Config {
  public constructor() {
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
      'local-private-custom-storage': {
        access: ['$all'],
        publish: ['$authenticated'],
        storage: 'private_folder',
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

    this.server_id = 'severMockId';

    this.getMatchedPackagesSpec = (pkgName) => getMatchedPackagesSpec(pkgName, this.packages);

    this.checkSecretKey = (secret) => {
      if (!secret) {
        const newSecret = 'superNewSecret';

        this.secret = newSecret;

        return newSecret;
      }
      return secret;
    };
  }
}
