import path from 'path';
import {runVerdaccio} from '../../utils/process';
import {installVerdaccio} from "../__partials/npm_commands";

describe('verdaccio info', ()=> {
	// @ts-ignore
	const tempRootFolder = global.__namespace.getItem('dir-root');
	const verdaccioInstall = path.join(tempRootFolder, 'verdaccio-root-info');
	let registryProcess;

	beforeAll(async () => {
		await installVerdaccio(verdaccioInstall);
	}, 30000);

	test('should run verdaccio info command', async () => {
		const pathVerdaccioModule = require.resolve('verdaccio/bin/verdaccio', {
			paths: [verdaccioInstall]
		});
		const hasMatch = await runVerdaccio(pathVerdaccioModule, verdaccioInstall, ['--info'], /Environment/);

		expect(hasMatch.ok).toBeTruthy();
	}, 20000);

	afterAll(() => {
		registryProcess.kill();
	});
});
