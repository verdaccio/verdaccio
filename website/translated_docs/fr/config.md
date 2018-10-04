---
id: configuration
title: "Fichier de configuration"
---
Ce fichier est le pilier de verdaccio où vous pouvez modifier le comportement par défaut, activer les plugins et étendre les fonctionnalités.

Un fichier de configuration par défaut est créé la première fois que vous exécutez `verdaccio`.

## Configuration par défaut

La configuration par défaut a un support pour les packs **portée(scoped)** et permet à tout utilisateur à accéder à tous les packs, mais seuls **les utilisateurs authentifiés qui peuvent publier**.

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

## Sections

Les sections suivantes expliquent ce que signifie chaque propriété et les différentes options.

### Stockage

Is the location of the default storage. **Verdaccio is by default based on local file system**.

```yaml
storage: ./storage
```

### Plugins

Is the location of the plugin directory. Useful for Docker/Kubernetes based deployments.

```yaml
plugins: ./plugins
```

### Authentification

The authentification set up is done here, the default auth is based on `htpasswd` and is built-in. You can modify this behaviour via [plugins](plugins.md). For more information about this section read the [auth page](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

This property allow you to modify the look and feel of the web UI. For more information about this section read the [web ui page](web.md).

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

## Advanced Settings

### Offline Publish

Par défaut `verdaccio` n'autorise pas le client à publier lorsqu'il est hors ligne, ce comportement peut être remplacé en définissant cette option *true*.

```yaml
publish:
  allow_offline: false
```

<small>Since: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### Préfixe de l'URL

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Since: `verdaccio@2.3.6` due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Taille maximale du corps

Par défaut, la taille maximale du corps d'un document JSON est `10mb`. Si vous rencontrez des erreurs telles que ` "entité requise trop grande" `, vous pouvez augmenter cette valeur.

```yaml
max_body_size: 10mb
```

### Port d’écoute

`verdaccio` s’exécute par défaut dans le port `4873`. La modification du port peut être faite via [cli](cli.md) ou dans le fichier de configuration, les options suivantes sont valides.

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

Pour activer `https` dans `verdaccio` il suffit de définir le drapeau `Ecoute` avec le protocole *https://*. Pour plus d’informations sur cette section, lisez [ssl page](ssl.md).

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