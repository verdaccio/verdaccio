import path from 'node:path';

export const parseConfigurationFile = (name: string) => {
  return path.join(__dirname, `../partials/config/yaml/${name}.yaml`);
};
