import { npm } from '../../utils/process';

export function installVerdaccio(verdaccioInstall) {
	return npm('install', '--prefix', verdaccioInstall, 'verdaccio', '--registry' ,'http://localhost:4873', '--no-package-lock');
}
