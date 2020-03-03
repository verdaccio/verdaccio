import envinfo from 'envinfo';

export default function infoCommand() {
	// eslint-disable-next-line no-console
	console.log('\nEnvironment Info:');
	(async () => {
		const data = await envinfo.run({
			System: ['OS', 'CPU'],
			Binaries: ['Node', 'Yarn', 'npm'],
			Virtualization: ['Docker'],
			Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
			npmGlobalPackages: ['verdaccio'],
		});
		// eslint-disable-next-line no-console
		console.log(data);
		process.exit(0);
	})();
}
