---
id: configuration
title: "Archivo de Configuración"
---
Este archivo es la piedra angular de verdaccio donde puedes modificar su comportamiento por defecto, activar plugins y características externas.

Cuando ejecutas por primera vez ` verdaccio` se crea un archivo de configuración por defecto.

## Configuración por Defecto

La configuración por defecto tiene soporte para paquetes con **enfoque** y permite a los usuarios acceder a todos los paquetes pero solo **a los usuarios autentificados a publicarlos**.

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

## Secciones

Las siguientes secciones explican que significa cada propiedad y las diferentes configuraciones posibles.

### Almacenamiento

Es la localización por defecto del almacenamiento. **Verdaccio esta basado por defecto en archivos locales de sistema**.

```yaml
storage: ./storage
```

### Autentificación

La configuración de autenticación es hecha aquí y esta basado en `htpasswd` y viene integrada por defecto. Puedes modificar el comportamiento por defecto vía [extensiones](plugins.md). Para mas información sobre esta sección lea [la página de autentificación](auth.md).

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: 1000
```

### Web UI

Esta propiedad te permite modificar diseño del interfaz de usuario. Para mas información sobre esta sección lea [la página de Web UI](web.md).

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

### Uplinks

Uplinks es la habilidad del sistema para traer paquetes de registros remotos cuando los paquetes no están disponibles localmente. Para mas información sobre esta sección lea [página de uplinks](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Paquetes

Paquetes permiten al usuario como los paquetes van a ser accedido. Para mas información sobre esta sección leer [la página de paquetes](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Configuración Avanzada

### Publicar modo sin conexión

Por defecto, `verdaccio` no permite publicar cuando el servidor esta en modo fuera de linea, este comportamiento puede ser sobrescrito cambiando el valor a *true*.

```yaml
publish:
  allow_offline: false
```

<small>Desde: <code>verdaccio@2.3.6</code> debido a <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### Prefijos URL

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Desde: `verdaccio@2.3.6` debido a [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Tamaño Máximo del Cuerpo

By default the maximum body size for a JSON document is `10mb`, if you run in errors as `"request entity too large"` you may increase this value.

```yaml
max_body_size: 10mb
```

### Puertos

`verdaccio` se ejecuta por defecto en el puerto `4873`. Cambiar el puerto se puede cambiar via [cli](cli.md) o en el archivo de configuración, las siguientes opciones son válidas.

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

Para habilitar`https` en `verdaccio` es suficiente con definir en `listen` en su dominio el protocolo *https://*. Para mas información sobre esta sección leer [página de Ssl](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxies tienen propósitos especiales en servidores HTTP diseñados para transferir datos desde servidores remotos a clientes locales.

#### http_proxy and https_proxy

Si ya tienes un proxy en tu red, puedes definir el encabezado `X-Forwarded-For` usando las siguientes propiedades.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

Esta variable debería contentener una lista de extensiones domínios separados por comas donde el proxy no debería ser usado.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

### Notificaciones

Habilita notificaciones en aplicaciones a terceros es muy sencillo via web hooks. Para más información sobre esta sección lea [la página de notificaciones](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Para información detallada sobre configuración, por favor [revise el código fuente](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit

`npm audit` is a new command released with [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio includes a built-in middleware plugin to handle this command.

> If you have a new installation it comes by default, otherwise you need to add the following props to your config file

```yaml
middlewares:
  audit:
    enabled: true
```