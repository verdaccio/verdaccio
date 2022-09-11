import { PluginOptions } from '@verdaccio/types';

import HTPasswd, { HTPasswdConfig } from './htpasswd';

export default function (config: HTPasswdConfig, params: PluginOptions): HTPasswd {
  return new HTPasswd(config, params);
}

export { HTPasswd, HTPasswdConfig };
