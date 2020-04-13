import { yellow, green, blue, magenta } from 'kleur';
import path from 'path';
import NodeEnvironment from 'jest-environment-node';
import {mockServer} from '@verdaccio/mock';
import ExpressServer from './simple_server';
import {PORT_SERVER_1, PORT_SERVER_2, PORT_SERVER_3} from '../config.functional';

const EXPRESS_PORT = 55550;

class FunctionalEnvironment extends NodeEnvironment {
  public config: any;

  public constructor(config: any) {
    super(config)
  }

  public async startWeb() {
    const express: any = new ExpressServer();

    return await express.start(EXPRESS_PORT);
  }


  public async setup() {
    // const SILENCE_LOG = !process.env.VERDACCIO_PROCESS_SILENCE || false;
    // @ts-ignore
    // const DEBUG_INJECT: boolean = process.env.VERDACCIO_DEBUG_INJECT ? process.env.VERDACCIO_DEBUG_INJECT : false;
    const forkList: any = [];
    const serverList: any = [];
    const pathStore = path.join(__dirname, '../store');
    const binPath = path.join(__dirname, '../../../bin/verdaccio');
    const listServers = [
      {
        port: PORT_SERVER_1,
        config: '/config-1.yaml',
        storage: '/server1'
      },
      {
        port: PORT_SERVER_2,
        config: '/config-2.yaml',
        storage: '/server2'
      },
      {
        port: PORT_SERVER_3,
        config: '/config-3.yaml',
        storage: '/server3'
      }
    ];
    console.log(green('Setup Verdaccio Servers'));

    const app = await this.startWeb();
    // @ts-ignore
    this.global.__WEB_SERVER__ = app;

    for (let serverConf of listServers) {
      const storePath = path.join(pathStore, serverConf.storage);
      const configPath = path.join(storePath, serverConf.config);
      const server = mockServer(serverConf.port, {
        storePath,
        configPath,
        silence: false
      });

      const fork = await server.init(binPath);
      console.log(magenta(`Running registry ${serverConf.config} on port ${serverConf.port}`));
      // @ts-ignore
      serverList.push(server.bridge);
      console.log(blue(`Fork PID ${fork[1]}`));
      forkList.push(fork);
    }

    // @ts-ignore
    this.global.__SERVERS_PROCESS__ = forkList;
    // @ts-ignore
    this.global.__SERVERS__ = serverList;
  }

  public async teardown() {
    await super.teardown();
    console.log(yellow('Teardown Test Environment.'));
    // @ts-ignore
    if (!this.global.__SERVERS_PROCESS__) {
      throw new Error("There are no servers to stop");
    }

    // shutdown verdaccio
    // @ts-ignore
    for (let server of this.global.__SERVERS_PROCESS__) {
      server[0].stop();
    }
    // close web server
    // @ts-ignore
    this.global.__WEB_SERVER__.server.close();
  }

  // @ts-ignore
  public runScript(script: string) {
  // @ts-ignore
    return super.runScript(script);
  }
}

module.exports = FunctionalEnvironment;
