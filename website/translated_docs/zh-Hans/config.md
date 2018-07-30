---
id: 配置
title: "配置文件"
---
此文件是 Verdaccio 的重要部分, 您可以在其中修改默认行为, 启用插件并扩展功能。

一个默认的配置文件已经在您首次运行 ` Verdaccio ` 时创建。

## 默认配置

默认配置支持 ** 私有(scoped) ** 包, 并允许匿名访问非私有包, 但只有 ** 已登陆用户才能发布包**。

```yaml
storage: ./storage
auth:
  htpasswd:
    file: ./htpasswd
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
  '**':
    proxy: npmjs
logs:
  - {type: stdout, format: pretty, level: http}
```

## 模块

以下各章节解释了每个属性的含义以及不同的选项。

### 存储

是默认的存储方式。** Verdaccio 默认使用内置本地文件模式存储 **。

```yaml
storage: ./storage
```

### 插件

是插件目录的位置。对Docker/Kubernetes 基础上的配置非常有用。

```yaml
plugins: ./plugins
```

### 认证

认证设置在这里完成，默认的授权是基于`htpasswd` 并且是内置的。 您可以通过[plugins](plugins.md)来修改此行为。 如需了解更多关于本章节的信息，请阅读[auth page（页面）](auth.md)。

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

此属性让您可以修改此web UI的外观和感觉。如需了解更多关于此章节的信息，请阅读 [web ui page（web ui 页面）](web.md)。

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

### 上行链路

当包不在本地的时候，上行链路可以让系统从远程的registry里获取这些包。 如需了解更多关于本章节的信息，请阅读[uplinks page（上行链路页面）](uplinks.md)。

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### 包

包让用户控制访问包的权限。如需了解更多关于此章节的信息，请阅读[packages page（包页面）](packages.md)。

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## 高级设置

### 脱线发布

`verdaccio`默认不允许客户脱线的时候发布，可以把这设置为*true*来覆盖此行为。

```yaml
publish:
  allow_offline: false
```

<small>Since: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### URL 前缀

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Since: `verdaccio@2.3.6` due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### 最大正文大小

默认的最大JSON 文件正文大小为`10mb`, 如果遇到`"request entity too large"` 的错误提示，您可以增大此数值。

```yaml
max_body_size: 10mb
```

### 监听端口

`verdaccio` runs by default in the port `4873`. Changing the port can be done via [cli](cli.md) or in the configuration file, the following options are valid.

```yaml
listen:
# - localhost:4873            # default value
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### HTTPS

To enable `https` in `verdaccio` it's enough to set the `listen` flag with the protocol *https://*. For more information about this section read the [ssl page](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxies are special-purpose HTTP servers designed to transfer data from remote servers to local clients.

#### http_proxy and https_proxy

If you have a proxy in your network you can set a `X-Forwarded-For` header using the following properties.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

This variable should contain a comma-separated list of domain extensions proxy should not be used for.

```yaml
no_proxy: localhost,127.0.0.1
```

### Notifications

Enabling notifications to third-party tools is fairly easy via web hooks. For more information about this section read the [notifications page](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> 有关更多配置设置的详细信息，请[核对源代码](https://github.com/verdaccio/verdaccio/tree/master/conf)。

### Audit

<small>Since: <code>verdaccio@3.0.0</code></small>

`npm audit` is a new command released with [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio includes a built-in middleware plugin to handle this command.

> 新安装采用默认版本，但是您可以添加以下代码段到配置文件中

```yaml
middlewares:
  audit:
    enabled: true
```