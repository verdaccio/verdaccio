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

Las siguientes secciones explican que significa cada propiedad y todas sus diferentes opciones.

### Almacenamiento

Es la localización por defecto del almacenamiento. **Verdaccio esta basado por defecto en archivos locales de sistema**.

```yaml
storage: ./storage
```

### Extensiones

Es la localización del directorio de extensiones. Muy útil para despliegues basados en Docker/Kubernetes.

```yaml
plugins: ./plugins
```

### Autentificación

La configuración de autentificación es definida aquí, por defecto la autentificación esta basada en `htpasswd` y es por defecto. Puedes modificar el comportamiento via [extensiones](plugins.md). Para mas información sobre esta sección lee [la página de autentificación](auth.md).

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

Uplinks es la habilidad del sistema para descargar paquetes de registros remotos cuando dichos paquetes no estan disponibles localmente. Para mas información sobre esta sección lea [la página de uplinks](uplinks.md).

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

### Packages

Paquetes te permite controlar como los paquetes van a ser accedidos. Para mas información sobre esta sección lea [la páginas de paquetes](packages.md).

```yaml
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Configuración Avanzada

### Publicar fuera de línea

Por defecto `verdaccio`no permite publicar cuando el cliente esta fuera de línea, este comportamiento puede ser anulado ajustando esta propiedad a *true*.

```yaml
publish:
  allow_offline: false
```

<small>Desde: <code>verdaccio@2.3.6</code> due <a href="https://github.com/verdaccio/verdaccio/pull/223">#223</a></small>

### Prefijo URL

```yaml
url_prefix: https://dev.company.local/verdaccio/
```

Desde: `verdaccio@2.3.6` due [#197](https://github.com/verdaccio/verdaccio/pull/197)

### Tamaño Máximo del Cuerpo

Por defecto el tamaño máximo para el cuerpo de un documento JSON es de `10mb`, si encuentras errores tales `"request entity too large"` tu podrías incrementar este valor.

```yaml
max_body_size: 10mb
```

### Puerto de Escucha

`verdaccio` se ejecuta por defecto en el puerto `4873`. Cambiar el puerto puede ser echo o bien via [cli](cli.md) o en el archivo de configuración, las siguientes opciones son válidas.

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

Para habilitar `https` en `verdaccio` es suficiente con definir el argumento `listen` con el protocolo *https://*. Para mas información sobre esta sección lea la [página de ssl](ssl.md).

```yaml
https:
    key: ./path/verdaccio-key.pem
    cert: ./path/verdaccio-cert.pem
    ca: ./path/verdaccio-csr.pem
```

### Proxy

Proxies tienen un proposito especial como servidores HTTP diseñados para transferir datos remotamente a clientes locales.

#### http_proxy and https_proxy

Si estás detras de un proxy en tu red puedes definir el encabezado `X-Forwarded-For` usando las siguientes propiedades.

```yaml
http_proxy: http://something.local/
https_proxy: https://something.local/
```

#### no_proxy

Esta variable debe contener una lista de dominios separados por coma los cuales no deberian ser usado el proxy.

```yaml
no_proxy: localhost,127.0.0.1
```

### Notificaciones

Habilitar notificaciones para herramientas a terceros es muy sencillo via web hooks. Para mas información sobre esta sección lea [notifications page](notifications.md).

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

> Para información detallada sobre configuración, por favor [revise el código fuente](https://github.com/verdaccio/verdaccio/tree/master/conf).

### Audit

<small>Desde: <code>verdaccio@3.0.0</code></small>

`npm audit` es un nuevo comando liberado con [npm 6.x](https://github.com/npm/npm/releases/tag/v6.1.0). Verdaccio icluye una extensión middleware para el manejo de este comando.

> Si tienes una nueva instalación va incluida por defecto, de otro modo necesitarás añadir las siguientes propiedades a tu archivo config

```yaml
middlewares:
  audit:
    enabled: true
```