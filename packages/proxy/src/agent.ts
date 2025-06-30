import { Agents } from 'got-cjs';
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent';
import { Agent as HttpAgent } from 'node:http';
import { Agent as HttpsAgent } from 'node:https';
import { URL } from 'node:url';

import { AgentOptionsConf } from '@verdaccio/types';

class CustomAgents {
  private url: string;
  private proxy: string | undefined;
  private agentOptions: AgentOptionsConf;
  private agent: Agents;
  public constructor(url: string, proxy: string | undefined, agentOptions: AgentOptionsConf) {
    this.proxy = proxy;
    this.url = url;
    this.agentOptions = agentOptions;
    const { protocol } = this.getParsedUrl();
    this.agent = this.getAgent(protocol);
  }

  public get() {
    return this.agent;
  }

  private getAgent(protocol: string): Agents {
    const isHTTPS = protocol === 'https:';
    if (this.proxy) {
      const options = {
        proxy: this.proxy,
        ...this.agentOptions,
      };
      // use hpagent
      return isHTTPS
        ? { https: new HttpsProxyAgent(options) }
        : { http: new HttpProxyAgent(options) };
    } else {
      // use native http/https agent
      return isHTTPS
        ? { https: new HttpsAgent(this.agentOptions) }
        : { http: new HttpAgent(this.agentOptions) };
    }
  }

  private getParsedUrl() {
    return this.proxy ? new URL(this.proxy) : new URL(this.url);
  }
}

export default CustomAgents;
