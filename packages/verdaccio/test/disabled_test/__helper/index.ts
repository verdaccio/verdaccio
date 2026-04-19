import path from 'node:path';

export const parseConfigurationFile = (name) => {
  return path.join(import.meta.dirname, `../partials/config/yaml/${name}.yaml`);
};
