import { Application } from 'express';
import { Callback } from '@verdaccio/types';
/**
 * Trigger the server after configuration has been loaded.
 * @param {Object} config
 * @param {Object} cliArguments
 * @param {String} configPath
 * @param {String} pkgVersion
 * @param {String} pkgName
 */
declare function startVerdaccio(config: any, cliListen: string, configPath: string, pkgVersion: string, pkgName: string, callback: Callback): void;
declare function listenDefaultCallback(webServer: Application, addr: any, pkgName: string, pkgVersion: string): void;
export { startVerdaccio, listenDefaultCallback };
