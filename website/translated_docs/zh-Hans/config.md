---
id: configuration
date: 2017-07-10T23:36:56.503Z
title: 配置文件
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

默认的配置文件已经包含了基础的认证配置，它基于 `htpasswd` 并且已经内置于 Verdaccio 中。 您可以通过 [ 插件 ](plugins.md) 修改此行为。 如需了解更多信息，请阅读文档中的 ["认证" 部分](auth.md)

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

这个选项允许你定制 Web UI 的外观. 如需了解更多信息，请阅读文档中的 [Web UI 部分](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

### Uplinks

通过配置 Uplinks ，Verdaccio 可以从远程的仓库中获取本地尚未缓存的包。 如需了解更多信息，请阅读文档中的 [Uplinks 部分](uplinks.md)

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### 包

Packages allow the user how the packages are gonna be accessed. For more information about this section read the [packages page](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Advanced Settings

### Offline Publish

By default `verdaccio` does not allow to publish when the client is offline, that behavior can be overridden set it in to *true*.

```yaml
publish:
  allow_offline: false
```

<small>Since: <em>v2.3.6</em> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### URL Prefix

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Since: *v2.3.6* due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Max Body Size

By default the maximum body size for a JSON document is `1mb`, if you run in errors as `"request entity too large"` you may increase this value.

```yaml
max_body_size: 1mb
```

### Listen Port

`verdaccio` runs by default in the port `4873`. Change the port can be done via [cli](cli.md) or in the configuration file, the following options are valid.

```yaml
listen:
# - localhost:4873            # default value
# - http://localhost:4873     # same thing
# - 0.0.0.0:4873              # listen on all addresses (INADDR_ANY)
# - https://example.org:4873  # if you want to use https
# - [::1]:4873                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### HTTPS

To enable `https` in `verdaccio` enough with set your `listen` domain with the protocol *https://*. For more information about this section read the [ssl page](ssl.md).

```yaml
https:
  key: path/to/server.key
  cert: path/to/server.crt
  ca: path/to/server.pem
```

### Notifications

Enable notifications to three party tools is fairly easy via web hooks. For more information about this section read the [notifications page](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```