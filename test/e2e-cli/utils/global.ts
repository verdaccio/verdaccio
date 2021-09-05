const namespace = Object.create(null);
import buildDebug from 'debug';

const debug = buildDebug('verdaccio:e2e:global');

export function addItem(name, value) {
  namespace[name] = value;
}

export function getItem(name) {
  debug('get-item %o:%o', name, namespace);
  if (!(name in namespace)) {
    throw new Error('The item '.concat(name, ' does exist in the namespace'));
  }

  return namespace[name];
}
