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

The following sections explain what each property means and the different options.

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

Packages allow the user to control how the packages are gonna be accessed. For more information about this section read the [packages page](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Configuración Avanzada

### Publicar modo sin conexión

By default `verdaccio` does not allow to publish when the client is offline, that behavior can be overridden by setting this to *true*.

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

Por defecto el tamaño máximo de cuerpo para un documento JSON es `10mb`, si encuentras errores tales como `"request entity too large"` puedes incrementar este valor.

```yaml
max_body_size: 10mb
```

### Puertos

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

To enable `https` in `verdaccio` it's enough to set the `listen` flag with the protocol *https://*. Para mas información sobre esta sección leer [página de Ssl](ssl.md).

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
no_proxy: localhost,127.0.0.1
```

### Notificaciones

Enabling notifications to third-party tools is fairly easy via web hooks. For more information about this section read the [notifications page](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Para información detallada sobre configuración, por favor [revise el código fuente](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Revisión

<small>Desde: <code>verdaccio@3.0.0</code></small>

`npm audit` es un nuevo comando lanzado con [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio incluye una extensión de middleware integrada para el manejo de este comando.

> Si tienes una nueva instalación va incluida por defecto, de otro modo necesitarás añadir las siguientes propiedades a tu archivo config

```yaml
middlewares:
  audit:
    enabled: true
```