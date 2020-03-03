import path from 'path';

export const parseConfigurationFile = (name) => {
  return path.join(__dirname, `../partials/config/yaml/${name}.yaml`);
};
