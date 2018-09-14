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

## 章节

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

认证设置在这里完成，默认的授权是基于`htpasswd` 并且是内置的。 您可以通过[plugins](plugins.md)来修改此行为。 有关更多本章节的详细信息，请阅读[auth页面](auth.md)。

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

这个选项允许你定制 Web UI 的外观，如需了解更多信息请参阅 [Web UI 页面](web.md)

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### 上行链路

当包不在本地的时候，上行链路可以让系统从远程的registry里获取这些包。 有关更多本章节的详细信息，请阅读[上行链路页面](uplinks.md)。

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### 包

包让用户控制访问包的权限。有关更多本模块的详细信息，请阅读[包页面](packages.md)。

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

`verdaccio` 默认在`4873`端口运行。可以通过[cli](cli.md) 或者在配置文件里更改端口，以下选项有效。

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

要在 `verdaccio`启用`https`，只要用 *https://*协议来设置`listen` 标志。 有关更多此章节的详细信息，请阅读 [ssl page](ssl.md)。

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxy是专门把数据从远程服务器传输到本地客户端的HTTP 服务器。

#### http_proxy and https_proxy

如果您的网络里有proxy，您可以用以下属性设置`X-Forwarded-For` 页眉。

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

此变量应该包含一个proxy 本不应该用到的以逗号分开的域名扩展列表。

```yaml
no_proxy: localhost,127.0.0.1
```

### 通知

通过web hooks来启用第三方工具通知是很容易的。有关更多此章节的详细信息，请阅读 [notifications page（通知页面）](notifications.md)。

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> 有关更多配置设置的详细信息，请[核对源代码](https://github.com/verdaccio/verdaccio/tree/master/conf)。

### 审核

<small>Since: <code>verdaccio@3.0.0</code></small>

`npm audit` 是和[npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0)一起发布的新命令。Verdaccio 包含一个内置的middleware plugin(中间插件）来处理此命令。

> 新安装采用默认版本，但是您可以添加以下代码段到配置文件中

```yaml
middlewares:
  audit:
    enabled: true
```