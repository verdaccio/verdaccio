import path from 'node:path';

export const parseConfigurationFile = (conf: string) => {
  const { name, ext } = path.parse(conf);
  const format = ext.startsWith('.') ? ext.substring(1) : 'yaml';

  return path.join(import.meta.dirname, `../partials/config/${format}/${name}.${format}`);
};
