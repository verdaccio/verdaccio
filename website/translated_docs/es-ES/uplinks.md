---
id: uplinks
title: "Uplinks"
---
Un * uplink* es un enlace a un registro externo que provee acceso a paquetes externos.

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

| Propiedad    | Tipo    | Requerido | Ejemplo                                                                             | Soporte | Descripción                                                                                                        | Por Defecto |
| ------------ | ------- | --------- | ----------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ | ----------- |
| url          | string  | Yes       | https://registry.npmjs.org/                                                         | all     | El dominio del registro                                                                                            | npmjs       |
| ca           | string  | No        | ~./ssl/client.crt'                                                                  | all     | Ubicación del certificado SSL                                                                                      | Vacio       |
| timeout      | string  | No        | 100ms                                                                               | all     | timeout por petición                                                                                               | 30s         |
| maxage       | string  | No        | 10m                                                                                 | all     | limite máximo de fallos de cada petición                                                                           | 2m          |
| fail_timeout | string  | No        | 10m                                                                                 | all     | define el tiempo máximo cuando una petición falla                                                                  | 5m          |
| max_fails    | number  | No        | 2                                                                                   | all     | límite máximo de fallos                                                                                            | 2           |
| cache        | boolean | No        | [true,false]                                                                        | >= 2.1  | avoid cache tarballs                                                                                               | true        |
| auth         | list    | No        | type: [bearer,basic], [token: "token",token_env: [true,\<get name process.env\>]] | >= 2.5  | assigns the header 'Authorization' see: http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules | disabled    |
| headers      | list    | No        | authorization: "Basic YourBase64EncodedCredentials=="                               | all     | list of custom headers for the uplink                                                                              | disabled    |

### You Must know

* Uplinks must be registries compatible with the `npm` endpoints. Eg: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* and more.
* Setting `cache` to false will help to save space in your hard drive. This will avoid store `tarballs` but [it will keep metadata in folders](https://github.com/verdaccio/verdaccio/issues/391).
* Exceed with multiple uplinks might slow down the lookup of your packages due for each request a npm client does, verdaccio does 1 call for each uplink.
* The (timeout, maxage and fail_timeout) format follow the [NGINX measurement units](http://nginx.org/en/docs/syntax.html)