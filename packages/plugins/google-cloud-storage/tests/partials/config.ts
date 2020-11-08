import { VerdaccioConfigGoogleStorage } from '../../src/types';

class Config implements VerdaccioConfigGoogleStorage {
  projectId: string;
  keyFilename: string;
  bucket: string;
  kind: string;
  self_path: string;
  secret: string;
  user_agent: string;
  server_id: string;
  packages: PackageList;
  uplinks: UpLinksConfList;
  logs: LoggerConf[];
  // @ts-ignore
  security: Security;
  $key: any;
  $value: any;

  constructor() {
    this.config_path = './test';
    this.secret = '12345';
    this.uplinks = {
      npmjs: {
        url: 'http://never_use:0000/',
      },
    };
    this.server_id = '';
    this.user_agent = '';
    this.packages = {};
    this.logs = [];
    this.kind = 'partial_test_metadataDatabaseKey';
    this.bucket = 'verdaccio-plugin';
    this.projectId = 'verdaccio-01';
    // this.keyFilename = './verdaccio-01-56f693e3aab0.json';
  }
  checkSecretKey(): string {
    return '';
  }
  getMatchedPackagesSpec(): void {
    return;
  }
}

export default new Config();
