import HTPasswd from './htpasswd';

/**
 * A new instance of HTPasswd class.
 * @param {object} config
 * @param {object} stuff
 * @returns {object}
 */
export default function (config, stuff): HTPasswd {
  return new HTPasswd(config, stuff);
}
