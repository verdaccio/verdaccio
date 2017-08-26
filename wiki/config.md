# Configuration File

This file is the cornerstone of verdaccio where you can modify the default behaviour, enable plugins and extend features.

A default configuration file is created the very first time you run `verdaccio`.

## Default Configuration

The default configuration has support for **scoped** packages and allow any user to access all packages but only **authenticated users to publish**.

```
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

The following sections explain what means each property and the different otpions

### Storage

Is the location of the default storage. **Verdaccio is by default based on local file system**.

```
storage: ./storage
```

### Authentification

The authentification set up is done here, the default auth is based on `htpasswd` and is build-in. You can modify this behaviour via [plugins](plugins.md). For more information about this section read the [auth page](auth.md).

```
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

This properties allow you to modify the look and feel of the web UI. For more information about this section read the [web ui page](web.md).

```
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

### Upkinks

Uplinks is the avility of the system to proxy package from remote registries when those package are not available locally. For more information about this section read the [uplinks page](uplinks.md).


```
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```














 