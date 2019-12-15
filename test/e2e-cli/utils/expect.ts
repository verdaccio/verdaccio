import * as fs from 'fs-extra';

export function expectFileToExist(fileName: string) {
	return new Promise((resolve, reject) => {
		fs.exists(fileName, (exist) => {
			if (exist) {
				resolve(exist);
			} else {
				reject(new Error(`File ${fileName} was expected to exist but not found...`));
			}
		});
	});
}
