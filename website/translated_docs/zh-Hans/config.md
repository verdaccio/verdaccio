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

以下各章节解释了每一个选项的作用和可用的值

### 存储

是默认的存储方式。** Verdaccio 默认使用内置本地文件模式存储 **。

```yaml
storage: ./storage
```

### 认证

在这里完成授权设置，默认授权是基于`htpasswd` 并且是内置的。 您可以通过 [ 插件 ](plugins.md) 修改此行为。 如需了解更多信息，请阅读文档中的 ["认证" 部分](auth.md)

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

这个选项允许你定制 Web UI 的外观. 如需了解更多信息，请阅读文档中的 ["Web UI" 部分](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

### Uplinks

通过配置 Uplinks ，Verdaccio 可以从远程的仓库中获取本地尚未缓存的包。 如需了解更多信息，请阅读文档中的 ["Uplinks" 部分](uplinks.md)

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### 包

"包" 部分定义了用户访问仓库中的包的权限。如需了解更多信息，请阅读文档中的 [ "包" 部分](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## 高级设置

### 离线发布

`Verdaccio` 默认不允许在与 Uplinks 断开连接后发布任何包，但是通过设置以下选项为 *true* 来允许离线发布。

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

默认的 JSON 文件最大正文大小是`10mb`, 如果遇到`“请求实体太大”`的错误，您可以增大此数值。

```yaml
max_body_size: 10mb
```

### 监听端口

`Verdaccio` 默认使用 `4873` 端口. 可以通过 [命令行传递参数](cli.md) 或修改配置文件，以下格式是有效的。

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

可通过在 `listen` 的域名前增加 *https://* 并设置证书路径来启用 `Verdaccio` 的 HTTPS 支持。 如需了解更多信息，请阅读文档中的 ["SSL" 部分](ssl.md)

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### 代理服务器

代理服务器是专门把数据从远程服务器传输到本地客户端的HTTP 服务器。

#### http_proxy and https_proxy

如果您的网络里有代理服务器，您可以使用以下属性来设置`X-Forwarded-For`页眉。

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

此变量应该包含一个代理服务器不应该被用到的，以逗号分隔的域名扩展列表。

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

### 通知

使用web hooks来启用三方工具通知是非常容易的。如需了解更多此部分的内容，请阅读[通知页面](notifications.md)。

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

`npm audit` 是和[npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0) 一起发布的新命令。Verdaccio 包含一个内置的中间体插件来处理此命令。

> 新安装采用默认版本，但是您可以添加以下代码段到配置文件中

```yaml
middlewares:
  audit:
    enabled: true
```