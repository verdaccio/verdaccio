export { parseConfigFile } from './lib/utils';
export { startVerdaccio as default, startVerdaccio } from './lib/bootstrap';
// Similar structure as v6 but with different functions
// this is a bridge for easy migration to v6
export { runServer } from './lib/run-server';
