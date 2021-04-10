import HTPasswd, { HTPasswdConfig } from './htpasswd';

export default function (config: HTPasswdConfig, stuff): HTPasswd {
  return new HTPasswd(config, stuff);
}

export { HTPasswd, HTPasswdConfig };
