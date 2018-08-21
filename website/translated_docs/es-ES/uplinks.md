---
id: uplinks
title: "Uplinks"
---
Un *uplink* es un enlace a un registro externo que provee acceso a paquetes externos.

![Uplinks](/img/uplinks.png)

### Uso

```yaml
uplinks:
  npmjs:
   url: https://registry.npmjs.org/
  server2:
    url: http://mirror.local.net/
    timeout: 100ms
  server3:
    url: http://mirror2.local.net:9000/
  baduplink:
    url: http://localhost:55666/
```

### Configuración

Puedes definir múltiples uplinks y cada uno de ellos debe tener un nombre único (key). Pueden tener las siguientes propiedades:

| Propiedad    | Tipo    | Requerido | Ejemplo                               | Soporte | Descripción                                                                                                                       | Por Defecto |
| ------------ | ------- | --------- | ------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| url          | string  | Yes       | https://registry.npmjs.org/           | all     | El dominio del registro                                                                                                           | npmjs       |
| ca           | string  | No        | ~./ssl/client.crt'                    | all     | Ubicación del certificado SSL                                                                                                     | Desactivado |
| timeout      | string  | No        | 100ms                                 | all     | timeout por petición                                                                                                              | 30s         |
| maxage       | string  | No        | 10m                                   | all     | limite máximo de fallos de cada petición                                                                                          | 2m          |
| fail_timeout | string  | No        | 10m                                   | all     | define el tiempo máximo cuando una petición falla                                                                                 | 5m          |
| max_fails    | number  | No        | 2                                     | all     | límite máximo de fallos                                                                                                           | 2           |
| cache        | boolean | No        | [true,false]                          | >= 2.1  | cache all remote tarballs in storage                                                                                              | true        |
| auth         | list    | No        | [ver abajo](uplinks.md#auth-property) | >= 2.5  | asigna el encabezado 'Autorización' [más información](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules) | desactivado |
| headers      | list    | No        | ]]                                    | all     | listado de encabezados por uplink                                                                                                 | desactivado |
| strict_ssl   | boolean | No        | [true,false]                          | >= 3.0  | Es verdadero, requiere que el certificado SSL sea válido.                                                                         | true        |

#### Propiedad auth

La propiedad `auth` te permite usar un token auth con un uplink. Usando la variable de entorno por defecto:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`   
```

o a través de una variable de entorno específica:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN` utilizará internamente `process.env['FOO_TOKEN']`

o al especificar directamente un token:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> Nota: `token` tiene prioridad sobre `token_env`

### Debes saber

* Verdaccio no usa Basic Authentication desde la versión `v2.3.0`. Todos los tokens generados por verdaccio están basados en JWT ([JSON Web Token](https://jwt.io/))
* Uplinks must be registries compatible with the `npm` endpoints. Por ejemplo: *verdaccio*, `sinopia@1.4.0`, * npmjs registry*, *yarn registry*, *JFrog*, *Nexus* y más.
* Definiendo el `caché` como falso te ayudará a ahorrar espacio en tu disco duro. Esto evitará almacenar `tarballs` pero [ mantendrá los metadatos en carpetas](https://github.com/verdaccio/verdaccio/issues/391).
* Excederse con múltiples uplinks puede ralentizar la búsqueda de tus paquetes debido a que cada solicitud que un cliente npm realiza, verdaccio hace una llamada por cada uplink.
* El formato (timeout, maxage y fail_timeout) sigue las [unidades de medida NGINX](http://nginx.org/en/docs/syntax.html)