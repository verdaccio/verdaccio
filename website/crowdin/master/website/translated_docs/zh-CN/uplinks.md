---
id: uplinks（上行链路）
title: "上行链路"
---

An *uplink* is a link with an external registry that provides access to external packages.

![上行链路](https://user-images.githubusercontent.com/558752/52976233-fb0e3980-33c8-11e9-8eea-5415e6018144.png)

### 用法

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

### 配置

You can define mutiple uplinks and each of them must have an unique name (key). They can have the following properties:

| 属性            | 类型      | 必须的 | 范例                                      | 支持版本     | 描述                                                                                                                                                                       | 默认值   |
| ------------- | ------- | --- | --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| url           | string  | 是   | https://registry.npmjs.org/             | 全部       | 外部注册服务器URL                                                                                                                                                               | npmjs |
| ca            | string  | 否   | ~./ssl/client.crt'                      | 全部       | SSL证书文件路径                                                                                                                                                                | 无默认值  |
| timeout       | string  | 否   | 100ms                                   | 全部       | 为请求设置新的超时时间                                                                                                                                                              | 30s   |
| maxage        | string  | 否   | 10m                                     | 全部       | the time threshold to the cache is valid                                                                                                                                 | 2m    |
| fail_timeout  | string  | 否   | 10m                                     | 全部       | 请求在连续失败超过指定次数后的最长等待重试时间                                                                                                                                                  | 5m    |
| max_fails     | number  | 否   | 2                                       | 全部       | 请求连续失败的最大次数限制                                                                                                                                                            | 2     |
| cache         | boolean | 否   | [true,false]                            | >= 2.1   | 缓存下载的远程tarball文件到本地                                                                                                                                                      | true  |
| auth          | list    | 否   | [见下文](uplinks.md#auth-property)         | >= 2.5   | 指定“授权authorization”请求头的内容 [详情见](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules)                                                              | 禁用    |
| headers       | list    | 否   | authorization: "Bearer SecretJWToken==" | 全部       | 上行链路请求的请求头header列表                                                                                                                                                       | 禁用    |
| strict_ssl    | boolean | 否   | [true,false]                            | >= 3.0   | 为true时，会检测SSL证书的有效性                                                                                                                                                      | true  |
| agent_options | object  | 否   | maxSockets: 10                          | >= 4.0.2 | options for the HTTP or HTTPS Agent responsible for managing uplink connection persistence and reuse [more info](https://nodejs.org/api/http.html#http_class_http_agent) | 无默认值  |

#### Auth属性

`auth` 属性内容是向上行链路发起请求时提供的授权令牌。例如使用默认环境变量:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`
```

或者使用一个指定的环境变量

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN`内部将使用 `process.env['FOO_TOKEN']`

或者直接指定令牌:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> 注意: `token`的优先级高于`token_env`

### 须知

* Uplinks must be registries compatible with the `npm` endpoints. Eg: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* and more.
* Setting `cache` to false will help to save space in your hard drive. This will avoid store `tarballs` but [it will keep metadata in folders](https://github.com/verdaccio/verdaccio/issues/391).
* Exceed with multiple uplinks might slow down the lookup of your packages due for each request a npm client does, verdaccio does 1 call for each uplink.
* The (timeout, maxage and fail_timeout) format follow the [NGINX measurement units](http://nginx.org/en/docs/syntax.html)