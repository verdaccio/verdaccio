export { getDefaultConfig } from '@verdaccio/config';
export { initialSetup } from './registry';
export {
  addNpmPrefix,
  addYarnClassicPrefix,
  addRegistry,
  prepareYarnModernProject,
  prepareGenericEmptyProject,
  nJSONParse,
} from './utils';
export { exec, ExecOutput } from './process';
