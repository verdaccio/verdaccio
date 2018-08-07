---
id: configuration
title: "Plik konfiguracyjny"
---
Plik ten jest podstawą verdaccio, ponieważ to w nim możesz modyfikować domyślne zachowanie aplikacji, rozszerzać jej funkcje oraz włączać wtyczki.

Domyślny plik konfiguracyjny jest tworzony, gdy po raz pierwszy uruchomisz `verdaccio`.

## Podstawowa konfiguracja

The default configuration has support for **scoped** packages and allow any user to access all packages but only **authenticated users to publish**.

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

## Sekcje

The following sections explain what each property means and the different options.

### Storage

Is the location of the default storage. **Verdaccio is by default based on local file system**.

```yaml
storage: ./storage
```

### Wtyczki

Is the location of the plugin directory. Useful for Docker/Kubernetes based deployments.

```yaml
plugins: ./plugins
```

### Uwierzytelnianie

Uwierzytelnianie jest wykonywane tutaj, podstawowe uwierzytelnianie jest oparte o `htpasswd` i jest wbudowane w aplikację. Możesz modyfikować jego zachowanie poprzez [wtyczki](plugins.md). Więcej informacji o tej sekcji znajdziesz na [stronie dotyczącej uwierzytelniania](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Internetowy interfejs użytkownika

Te właściwości pozwalają Ci zmienić wygląd internetowego interfejsu użytkownika. Aby uzyskać więcej informacji na temat tej sekcji, przeczytaj stronę dotyczącą [internetowego interfejsu użytkownika](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

### Uplinks

Uplinks is the ability of the system to fetch packages from remote registries when those packages are not available locally. For more information about this section read the [uplinks page](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Packages

Packages allow the user to control how the packages are gonna be accessed. For more information about this section read the [packages page](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Ustawienia zaawansowane

### Publikowanie w trybie offline

Domyślnie `verdaccio` nie pozwala na publikowanie w trybie offline, można to zmienić poprzez ustawienie tej właściwości na *true*.

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

Aby aktywować `https` w `verdaccio` wystarczy ustawić flagę `listen` na protokół *https://*. Więcej informacji o tej sekcji znajdziesz na [stronie dotyczącej ssl](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxy to specjalne serwery HTTP stworzone do transferu danych z serwerów zdalnych do klientów lokalnych.

#### http_proxy and https_proxy

Jeśli posiadasz serwer proxy w swojej sieci możesz ustawić nagłówek `X-Forwarded-For` używając następujących właściwości.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

Ta zmienna powinna posiadać listę domen oddzieloną przecinkami, dla których proxy nie powinno być używane.

```yaml
no_proxy: localhost,127.0.0.1
```

### Powiadomienia

Dostarczanie powiadomień do aplikacji zewnętrznych jest całkiem łatwe poprzez web hooks. Aby uzyskać więcej informacji o tej sekcji przeczytaj [stronę dotyczącą powiadomień](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Bardziej szczegółowe ustawienia konfiguracji znajdziesz w [kodzie źródłowym](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit

<small>Since: <code>verdaccio@3.0.0</code></small>

`npm audit` to nowa komenda wydana razem z [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio zawiera wbudowany plugin oprogramowania pośredniego do obsługi tej komendy.

> If you have a new installation it comes by default, otherwise you need to add the following props to your config file

```yaml
middlewares:
  audit:
    enabled: true
```