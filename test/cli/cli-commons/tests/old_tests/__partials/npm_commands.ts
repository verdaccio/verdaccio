import { silentNpm } from '../../utils/process';

export function installVerdaccio(verdaccioInstall) {
  return silentNpm(
    'install',
    '--prefix',
    verdaccioInstall,
    'verdaccio',
    '--registry',
    'http://localhost:6001',
    '--no-package-lock'
  );
}
