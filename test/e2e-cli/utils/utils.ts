import path from "path";
import fs from "fs";

export function copyConfigFile(rootFolder, configTemplate): string {
	const configPath = path.join(rootFolder, 'verdaccio.yaml');
	fs.copyFileSync(path.join(__dirname, configTemplate), configPath);

	return configPath;
}
