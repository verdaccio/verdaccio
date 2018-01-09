---
id: configuration
title: Configuration File
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

The authentification set up is done here, the default auth is based on `htpasswd` and is built-in. 您可以通过 [ 插件 ](plugins.md) 修改此行为。 如需了解更多信息，请阅读文档中的 ["认证" 部分](auth.md)

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

`Verdaccio` 默认不允许在与 Uplinks 断开连接后发布任何包，但是通过设置以下选项为 *ture* 来允许离线发布

```yaml
publish:
  allow_offline: false
```

<small>最低版本: <em> v2.3.6 </em> 由于 <a href="https://github.com/verdaccio/verdaccio/pull/223"> #223 </a></small>

### URL 前缀

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

最低版本: * v2.3.6 * 由于 [ #197 ](https://github.com/verdaccio/verdaccio/pull/197)

### 最大 Body 尺寸

默认的 JSON 请求 Body 尺寸为 `1MB`，如果你遇到了错误提示 `"request entity too large"` ，可以尝试增大这个值

```yaml
max_body_size: 1mb
```

### 监听端口

`Verdaccio` 默认使用 `4873` 端口. 可以通过 [命令行传递参数](cli.md) 或修改配置文件，以下格式是有效的

```yaml
listen:
# - localhost:4873            # 默认
# - http://localhost:4873     # 同上
# - 0.0.0.0:4873              # 监听所有 IP 地址 (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - [::1]:4873                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### HTTPS

可通过在 `listen` 的域名前增加 *https://* 并设置证书路径来启用 `Verdaccio` 的 HTTPS 支持。 如需了解更多信息，请阅读文档中的 ["SSL" 部分](ssl.md)

```yaml
https:
  key: path/to/server.key
  cert: path/to/server.crt
  ca: path/to/server.pem
```

### 通知

可以通过启用 "通知" 功能来调用第三方工具的 Web Hooks。如需了解更多信息，请阅读文档中的 ["通知" 部分](notifications.md)

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"发布了新的包: * {{ name }}*","notify":true,"message_format":"text"}'
```