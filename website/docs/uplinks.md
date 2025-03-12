---
id: uplinks
title: 'Uplinks'
---

An _uplink_ is a link with an external registry that provides access to external packages.

![Uplinks](https://user-images.githubusercontent.com/558752/52976233-fb0e3980-33c8-11e9-8eea-5415e6018144.png)

### Usage {#usage}

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
  server2:
    url: http://mirror.local.net/
    timeout: 100ms
  server3:
    url: http://mirror2.local.net:9000/
  baduplink:
    url: http://localhost:55666/
```

Here's an example of seamlessly integrating npmjs and GitHub registries using Verdaccio:
[How to use Verdaccio with GitHub registry](https://dev.to/verdaccio/how-to-use-verdaccio-with-github-registry-2ejj)

### Configuration {#configuration}

You can define mutiple uplinks and each of them must have an unique name (key). They can have the following properties:

| Property      | Type    | Required | Example                                 | Support  | Description                                                                                                                                                              | Default    |
| ------------- | ------- | -------- | --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| url           | string  | Yes      | https://registry.npmjs.org/             | all      | The registry url                                                                                                                                                         | npmjs      |
| ca            | string  | No       | ~./ssl/client.crt'                      | all      | SSL path certificate                                                                                                                                                     | No default |
| timeout       | string  | No       | 100ms                                   | all      | set new timeout for the request                                                                                                                                          | 30s        |
| maxage        | string  | No       | 10m                                     | all      | the time threshold to the cache is valid                                                                                                                                 | 2m         |
| fail_timeout  | string  | No       | 10m                                     | all      | defines max time when a request becomes a failure                                                                                                                        | 5m         |
| max_fails     | number  | No       | 2                                       | all      | limit maximun failure request                                                                                                                                            | 2          |
| http_proxy    | string  | No       | http://proxy.server.org                 | all      | define HTTP proxy for registry access                                                                                                                                    | No default |
| https_proxy   | string  | No       | https://proxy.server.org                | all      | define HTTPS proxy for registry access                                                                                                                                   | No default |
| no_proxy      | string  | No       | localhost,127.0.0.1                     | all      | comma-separated list of hosts that should not use proxy                                                                                                                  | No default |
| cache         | boolean | No       | [true,false]                            | >= 2.1   | cache all remote tarballs in storage                                                                                                                                     | true       |
| auth          | list    | No       | [see below](uplinks.md#auth-property)   | >= 2.5   | assigns the header 'Authorization' [more info](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules)                                               | disabled   |
| headers       | list    | No       | authorization: "Bearer SecretJWToken==" | all      | list of custom headers for the uplink                                                                                                                                    | disabled   |
| strict_ssl    | boolean | No       | [true,false]                            | >= 3.0   | If true, requires SSL certificates be valid.                                                                                                                             | true       |
| agent_options | object  | No       | maxSockets: 10                          | >= 4.0.2 | options for the HTTP or HTTPS Agent responsible for managing uplink connection persistence and reuse [more info](https://nodejs.org/api/http.html#http_class_http_agent) | No default |

#### Auth property {#auth-property}

The `auth` property allows you to use an auth token with an uplink. Using the default environment variable:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # by defaults points to the environment variable `NPM_TOKEN`
```

or via a specified _custom_ environment variable:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN # override the default `NPM_TOKEN` by a custom one
```

`token_env: FOO_TOKEN `internally will use `process.env['FOO_TOKEN']`

or by directly specifying a token oh the configuration file (not recommended by security corcerns):

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: 'token'
```

> Note: `token` has priority over `token_env`

### You Must know {#you-must-know}

- Uplinks must be registries compatible with the `npm` endpoints. Eg: _verdaccio_, `sinopia@1.4.0`, _npmjs registry_, _yarn registry_, _JFrog_, _Nexus_ and more.
- Setting `cache` to false will help to save space in your hard drive. This will avoid store `tarballs` but [it will keep metadata in folders](https://github.com/verdaccio/verdaccio/issues/391).
- Multiple uplinks might slow down the lookup of your packages. For each request an npm client makes, verdaccio makes 1 call to each configured uplink.
- The (timeout, maxage and fail_timeout) format follow the [NGINX measurement units](http://nginx.org/en/docs/syntax.html)
- When using the [Helm Chart](https://github.com/verdaccio/charts), you can use `secretEnvVars` to inject sensitive environment variables, which can be used to configure private uplink auth.
