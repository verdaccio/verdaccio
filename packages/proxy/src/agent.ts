import { Agents } from 'got-cjs';
import { HttpProxyAgent, HttpsProxyAgent } from 'hpagent';
import { Agent as HttpAgent, AgentOptions as HttpAgentOptions } from 'http';
import { Agent as HttpsAgent, AgentOptions as HttpsAgentOptions } from 'https';
import { URL } from 'url';

export type AgentOptionsConf = HttpAgentOptions | HttpsAgentOptions;

class CustomAgents {
  private url: string;
  private proxy: string | undefined;
  private agentOptions: HttpAgentOptions | HttpsAgentOptions;
  private agent: Agents;
  public constructor(
    url: string,
    proxy: string | undefined,
    agentOptions: HttpAgentOptions | HttpsAgentOptions
  ) {
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
