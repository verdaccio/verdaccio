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

| Propiedad    | Tipo    | Requerido | Ejemplo                                                                             | Soporte | Descripción                                                                                                          | Por Defecto |
| ------------ | ------- | --------- | ----------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------- | ----------- |
| url          | string  | Yes       | https://registry.npmjs.org/                                                         | all     | El dominio del registro                                                                                              | npmjs       |
| ca           | string  | No        | ~./ssl/client.crt'                                                                  | all     | Ubicación del certificado SSL                                                                                        | Desactivado |
| timeout      | string  | No        | 100ms                                                                               | all     | timeout por petición                                                                                                 | 30s         |
| maxage       | string  | No        | 10m                                                                                 | all     | limite máximo de fallos de cada petición                                                                             | 2m          |
| fail_timeout | string  | No        | 10m                                                                                 | all     | define el tiempo máximo cuando una petición falla                                                                    | 5m          |
| max_fails    | number  | No        | 2                                                                                   | all     | límite máximo de fallos                                                                                              | 2           |
| cache        | boolean | No        | [true,false]                                                                        | >= 2.1  | evita persistir tarballs                                                                                             | true        |
| auth         | list    | No        | type: [bearer,basic], [token: "token",token_env: [true,\<get name process.env\>]] | >= 2.5  | asigna el encamezado 'Authorization' ver: http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules | desactivado |
| headers      | list    | No        | authorization: "Basic YourBase64EncodedCredentials=="                               | all     | listado de encabezados por uplink                                                                                    | desactivado |
| strict_ssl   | boolean | No        | [true,false]                                                                        | >= 3.0  | Es verdadero, requiere que el certificado SSL sea válido.                                                            | true        |

> La propiedad ` auth` te permite usar token te autenticación vía variables de entorno, [haz click aqui para ver un ejemplo](https://github.com/verdaccio/verdaccio/releases/tag/v2.5.0).

### Debes saber

* Uplinks deben ser compatibles con los *endpoints* de `npm`. Ejemplo: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* y más.
* Definiendo `cache` a falso ayudará a salvar espacio en tu disco duro. Esto evitará almacenar `tarballs` pero [mantendrá metadatos en los folders](https://github.com/verdaccio/verdaccio/issues/391).
* Excederse con muchos uplinks podría afectar el performance al momento de resolver paquetes por cada request que el cliente npm ejecuta, verdaccio hace 1 llamada por cada uplink.
* Los parametros (timeout, maxage and fail_timeout) siguen el formato de [NGINX measurement units](http://nginx.org/en/docs/syntax.html)