import path from 'path';

export const parseConfigurationFile = (conf: string) => {
  const { name, ext } = path.parse(conf);
  const format = ext.startsWith('.') ? ext.substring(1) : 'yaml';

  return path.join(__dirname, `../partials/config/${format}/${name}.${format}`);
};
