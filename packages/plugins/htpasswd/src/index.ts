import type { pluginUtils } from '@verdaccio/core';

import HTPasswd, { type HTPasswdConfig } from './htpasswd';

export default function (config: HTPasswdConfig, params: pluginUtils.PluginOptions): HTPasswd {
  return new HTPasswd(config, params);
}

export { HTPasswd, type HTPasswdConfig };
