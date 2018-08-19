---
id: configuration
title: "Файл конфигурации"
---
Этот файл является краеугольным камнем verdaccio. В нём вы можете изменить стандартное поведение, включить плагины и расширенные возможности.

Стандартный файл конфигурации создаётся при самом первом запуске `verdaccio`.

## Стандартная конфигурация

Стандартная конфигурация поддерживает **область видимости (scope)** пакетов и позволяет любым пользователям получить доступ ко всем пакетам, но **только авторизованные пользователи могут публиковать пакеты**.

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

## Разделы

Следующие разделы пояснят что означает каждое свойство и его различные опции.

### Хранилище

Местоположение хранилища по умолчанию. **По умолчанию Verdaccio определит исходя из локальной файловой системы**.

```yaml
storage: ./storage
```

### Плагины

Местоположения директории с плагинами. Полезно при развёртывании при помощи Docker/Kubernetes.

```yaml
plugins: ./plugins
```

### Аутентификация

Настройка аутентификация делается здесь. По умолчанию аутентификация основана на `htpasswd` и является встроенной. Вы можете изменить это при помощи [плагинов](plugins.md). Читайте об этом в разделе [Аутентификация](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Веб интерфейс

Эти свойства позволят вам изменить внешний вид веб интерфейса. Читайте об это в разделе [Веб интерфейса](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### Подключения

Каналы — это способность системы получать пакетов из удаленных реестров, если эти пакеты не доступны локально. Читайте об этом в разделе [Каналы](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Пакеты

Секция пакеты позволяет пользователю контролировать доступ к пакетам. Читайте об этом в разделе [Пакеты](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Расширенные настройки

### Публикация без подключения к сети

По умолчанию `verdaccio` не позволяет публиковать пакеты, если у клиента не подключения к сети. Это может быть изменено устновкой данного параметрв в *true*.

```yaml
publish:
  allow_offline: false
```

<small>Since: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### URL Prefix

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Since: `verdaccio@2.3.6` due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Max Body Size

By default the maximum body size for a JSON document is `10mb`, if you run in errors as `"request entity too large"` you may increase this value.

```yaml
max_body_size: 10mb
```

### Listen Port

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

> For more detailed configuration settings, please [check the source code](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit

<small>Since: <code>verdaccio@3.0.0</code></small>

`npm audit` is a new command released with [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio includes a built-in middleware plugin to handle this command.

> If you have a new installation it comes by default, otherwise you need to add the following props to your config file

```yaml
middlewares:
  audit:
    enabled: true
```