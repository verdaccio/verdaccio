---
id: konfigurace
title: "Konfigurační soubor"
---

Tento soubor je základní kámen verdaccia, kde můžete upravit výchozí chování, povolit doplňky a rozšířit funkčnost.

Výchozí konfigurační soubor `config.yaml` je vytvořen při prvním spuštění `verdaccia`.

## Výchozí konfigurace

Výchozí konfigurace má podporu pro balíčky **s rozsahem** a umožňuje každému uživateli přístup ke všem balíčkům, ale pouze **ověřeným uživatelům k publikování**.

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

## Sekce

Následující sekce vysvětlují co jaká vlastnost znamená a jaké má volby.

### Úložiště

Je umístění výchozího úložiště. **Ve výchozím nastavení je Verdaccio uloženo na lokálním úložišti.**.

```yaml
storage: ./storage
```

### Plugins

Je umístění složky s doplňky. Užitečné pro nasazení s Docker/Kubernetes.

```yaml
plugins: ./plugins
```

### Autentizace

Ověření se nastavuje zde, výchozí ověření je na základě `htpasswd` a je vestavěné. Toto chování můžete zmenit v [doplňky](plugins.md). Pro více informací o této sekci si přečtěte [ověřovací stránka](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Bezpečnost

<small>Od: <code>verdaccio@4.0.0</code> <a href="https://github.com/verdaccio/verdaccio/pull/168">#168</a></small>

Blok zabezpečení umožňuje přizpůsobit podpis tokenu. Chcete-li povolit nový [JWT (json webový token)](https://jwt.io/) podpis, je nutné přidat blok `jwt` do sekce `api`, `web` používá jako výchozí `jwt`.

Konfigurace je rozdělena do dvou sekcí, `api` a `web`. Pro použití JWT v `api` musí být definován, jinak bude používat starší podpis tokenu (`aes192`). Pro JWT můžete přizpůsobit [ověření](https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback) [podpisu](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback) a tokenu vlastními parametry.

    security:
      api:
        legacy: true
        jwt:
          sign:
            expiresIn: 29d
          verify:
            someProp: [value]
       web:
         sign:
           expiresIn: 7d # Výchozí hodnota 7 dní
         verify:
            someProp: [value]
    

> Doporučujeme přejít na JWT, protože starší podpis (`aes192`) je zastaralý a v budoucích verzích zmizí.

### Server

Sada vlastností ke změně chování serverové aplikace, konkrétně rozhraní API (Express.js).

> Můžete nastavit, jak dlouho má server držet aktivní příchozí spojení v sekundách pro HTTP/1.1. Hodnota 0 způsobuje, že se http server chová podobně jako Node.js před verzí 8.0.0, která neměla časový limit pro zachování. Možné řešení: Prostřednictvím dané konfigurace můžete vyřešit následující problém https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.

```yaml
server:
  keepAliveTimeout: 60
```

### Web UI

Tato vlastnost umožňuje změnit vzhled webového uživatelského rozhraní. Další informace o této části naleznete na stránce [web ui](web.md).

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

Balíčky umožňují uživateli kontrolovat, jak budou balíčky zpřístupněny. Další informace o této sekci naleznete na [stránce balíků](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Pokročilá Nastavení

### Offline Publish

By default `verdaccio` does not allow to publish when the client is offline, that behavior can be overridden by setting this to *true*.

```yaml
publish:
  allow_offline: false
```

<small>Since: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### URL Prefix

```yaml
url_prefix: /verdaccio/
```

> We recommend use a subdirectory `/verdaccio/` instead a URI.

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

#### http_proxy a https_proxy

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

### Upozornění

Enabling notifications to third-party tools is fairly easy via web hooks. For more information about this section read the [notifications page](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"Publikován nový balíček: * {{ name }}*","notify":true,"message_format":"text"}'
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

### Experiments

This release includes a new property named `experiments` that can be placed in the `config.yaml` and is completely optional.

We want to be able to ship new things without affecting production environments. This flag allows us to add new features and get feedback from the community that wants to use them.

The features that are under this flag might not be stable or might be removed in future releases.

Here one example:

```yaml
experiments:
  token: false
```

> To disable the experiments warning in the console, you must comment out the whole `experiments` section.