---
id: packages
title: "Acceso a Paquetes"
---

Es una serie de restricciones que permiten o limitan el acceso al almacenamiento local basándose en criterios específicos.

Las restricciones de seguridad permanecen dependientes de la extensión en uso. Por defecto, `verdaccio` utiliza [htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd). Si usas una extensión diferente ten en cuenta que el comportamiento podría ser diferente. La extensión por defecto no maneja `allow_access` y `allow_publish` por sí misma, esta usa un recurso de seguridad interno en caso de que la extensión no esté lista para esto.

Para mas información sobre permisos, visite [la sección de autenticación](auth.md).

### Uso

```yalm
packages:
  # scoped packages
  '@scope/*':
    access: $all
    publish: $all
    proxy: server2

  'private-*':
    access: $all
    publish: $all
    proxy: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    access: $all
    publish: $all
    proxy: uplink2
```

si ninguno esta especificado, por defecto uno se define

```yaml
packages:
  '**':
    access: $all
    publish: $authenticated
```

The list internal groups handled by `verdaccio` are:

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

Todos los usuarios reciben todos estos conjuntos de permisos, independientemente de si son anonymous o no, además de los grupos proporcionados por la extensión. En caso de `htpasswd` retorna el nombre de usuario como un grupo. Por ejemplo, si has iniciado sesión como ` npmUser` el listado de grupos será.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Si deseas proteger un grupo de paquetes específicos dentro de tu grupo, debes realizar algo similar a esto. Vamos a usar un `Regex` que cubre los todos los páquetes prefijos con`npmuser-`. We recommend using a prefix for your packages, in that way it will be easier to protect them.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Reinicia `verdaccio` en tu terminal trata de instalar `npmuser-core`.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

Puedes cambiar el comportamiento por defecto usando una diferente extensión de autenticación. `verdaccio` simplemente comprueba si el usuario que intentó acceder o publicar un paquete específico pertenece al grupo correcto.

#### Definir múltiples grupos

Definir múltiples grupos de acceso es bastante sencillo, simplemente defínalos dejando un espacio en blanco entre ellos.

```yaml
  'company-*':
    access: admin internal
    publish: admin
    proxy: server1
  'supersecret-*':
    access: secret super-secret-area ultra-secret-area
    publish: secret ultra-secret-area
    proxy: server1
```

#### Bloqueando el acceso a paquetes

If you want to block the access/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Bloqueando proxy a un grupo específico de paquetes

Puede que quieras bloquear para uno o varios paquetes la capacidad de hacer fetching de repositorios remotos., pero, a la misma vez, permitir a otros acceder a *uplinks* diferentes.

Veamos el siguiente ejemplo:

```yaml
packages:
  'jquery':
    access: $all
    publish: $all
  'my-company-*':
    access: $all
    publish: $authenticated
  '@my-local-scope/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

Vamos a describir lo que se desea con el ejemplo anterior:

* Quiero almacenar mi propia dependencia ` jquery` pero necesito evitar que se busque en el proxy.
* Quiero que todas mis dependencias que coincidan con `my-company-*` pero necesito evitar que dichos paquetes se actualicen vía proxy.
* Quiero que todas las dependencias que estén en `my-local-scope` hagan scope pero necesito evitar que estas se actualicen vía proxy.
* Quiero que el resto de las dependencias se actualicen vía proxy.

Se **consciente que el orden de la definición de los paquetes es importante y siempre usa doble wildcard**. Porque si no lo incluyes, `verdaccio` lo incluirá por ti y la forma en que tus dependencias son resueltas se verá afectada.

#### Unpublishing Packages

The property `publish` handle permissions for `npm publish` and `npm unpublish`. But, if you want to be more specific, you can use the property `unpublish` in your package access section, for instance:

```yalm
packages:
  'jquery':
    access: $all
    publish: $all
    unpublish: root
  'my-company-*':
    access: $all
    publish: $authenticated
    unpublish: 
  '@my-local-scope/*':
    access: $all
    publish: $authenticated
    # unpublish: property commented out
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

In the previous example, the behaviour would be described:

* all users can publish the `jquery` package, but only the user `root` would be able to unpublish any version.
* only authenticated users can publish `my-company-*` packages, but **nobody would be allowed to unpublish them**.
* If `unpublish` is commented out, the access will be granted or denied by the `publish` definition.

### Configuración

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Propiedad | Tipo   | Requerido | Ejemplo        | Soporte        | Descripción                                                               |
| --------- | ------ | --------- | -------------- | -------------- | ------------------------------------------------------------------------- |
| access    | string | No        | $all           | all            | define que grupos estan permitidos para acceder al paquete                |
| publish   | string | No        | $authenticated | all            | defini que grupos estan permitidos a publicar                             |
| proxy     | string | No        | npmjs          | all            | limita las busquedas a un uplink específico                               |
| storage   | string | No        | string         | `/some-folder` | it creates a subfolder whithin the storage folder for each package access |

> Resaltamos que ya no recomendamos usar **allow_access**/**allow_publish** y **proxy_access**, estos son obsoletos y pronto serán removidos, por favor usar las versiones reducidas de estos (**access**/**publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).