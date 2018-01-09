---
id: uplinks
title: Uplinks
---
An *uplink* is a link with an external registry that provides acccess to external packages.

### Usage

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

### Configuration

You can define mutiple uplinks and each of them must have an unique name (key). They can have two properties:

| Property     | Type    | Required | Example                                                                             | Support | Description                                                                                                        | Default  |
| ------------ | ------- | -------- | ----------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| url          | string  | Yes      | https://registry.npmjs.org/                                                         | all     | The registry url                                                                                                   | npmjs    |
| timeout      | string  | No       | 100ms                                                                               | all     | set new timeout for the request                                                                                    | 30s      |
| maxage       | string  | No       | 10m                                                                                 | all     | limit maximun failure request                                                                                      | 2m       |
| fail_timeout | string  | No       | 10m                                                                                 | all     | defines max time when a request becomes a failure                                                                  | 5m       |
| max_fails    | number  | No       | 2                                                                                   | all     | limit maximun failure request                                                                                      | 2        |
| cache        | boolean | No       | [true,false]                                                                        | >= 2.1  | avoid cache tarballs                                                                                               | true     |
| auth         | list    | No       | type: [bearer,basic], [token: "token",token_env: [true,\<get name process.env\>]] | >= 2.5  | assigns the header 'Authorization' see: http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules | disabled |
| headers      | list    | No       | authorization: "Basic YourBase64EncodedCredentials=="                               | all     | list of custom headers for the uplink                                                                              | disabled |

### You Must know

* Uplinks must be registries compatible with the `npm` endpoints. Eg: *verdaccio*, *sinopia@1.4.0*, *npmjs registry*, *yarn registry* and more.
* Setting `cache` to false will help to save space in your hard drive.
* Exceed with multiple uplinks might slow down the lookup of your packages due for each request a npm client does, verdaccio does 1 call for each uplink.
* The (timeout, maxage and fail_timeout) format follow the [NGINX measurement units](http://nginx.org/en/docs/syntax.html)