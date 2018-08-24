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

<small>Начиная с: <code>verdaccio@2.3.6</code> в связи <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### URL приствка

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Начиная с: `verdaccio@2.3.6` в связи [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Максимальный размер

По умолчанию максимальный размер JSON документа `10 Мб`, если вы получаете ошибки типа `"request entity too large"`, то вы можете увеличить это значение.

```yaml
max_body_size: 10mb
```

### Рабочий порт

`verdaccio` по умолчанию запускается на порту `4873`. Изменить порт можно при помощи [Интерфейса командной строки](cli.md) или в файле конфигурации. Следующие значения являются правильными.

```yaml
listen:
# - localhost:4873            # значение по умолчанию
# - http://localhost:4873     # тоже самое
# - 0.0.0.0:4873              # работа на всех адресах (INADDR_ANY)
# - https://example.org:4873  # если нужно использовать https
# - "[::1]:4873"                # ipv6
# - unix:/tmp/verdaccio.sock    # unix socket
```

### HTTPS

Для включения `https` в `verdaccio` достаточно устанновить опцию `listen` в значение с протоколом *https://*. Читайте об этом в разделе [SSL](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Проксирование

Прокси сервера, это специально предназначенные сервера для передачи от удалённых серверов к локальным клиентам.

#### http_proxy и https_proxy

Если в вашей сети используется прокси, вы можете установить `X-Forwarded-For` заголовок использую следующие свойства.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

Это свойство должно содержать разделённый через запятую список доменов, для которых прокси не будет использоваться.

```yaml
no_proxy: localhost,127.0.0.1
```

### Уведомления

Уведомления для сторонних инструментов включаются очень просто через web hooks. Читайте об этом в разделе [Уведомления](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Для более детальной настройки, пожалуйста [загляните в исходнй код](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Аудит

<small>Начиная с: <code>verdaccio@3.0.0</code></small>

`npm audit` это новая команда, добавленная в [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio имеет встроенный плагин для обработки этой команды.

> Если это у вас вновь созданная конфигурация, то значение будет установлено по умолчанию. Если нет, вам необходимо добавить эти опции в ваши файл конфигурации

```yaml
middlewares:
  audit:
    enabled: true
```