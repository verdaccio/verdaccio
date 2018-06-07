---
id: packages
title: "Acceso a Paquetes"
---
It's a series of contraints that allow or restrict access to the local storage based in specific criteria.

The security constraints remain on the shoulders of the plugin being used, by default `verdaccio` uses the [htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd). Si usas una extensión diferente ten en cuenta que el comportamiento podría ser diferente. The default plugin does not handle `allow_access` and `allow_publish` by itself, it uses an internal fallback in case the plugin is not ready for it.

Para mas información sobre permisos, visite [la sección de autenticación](auth.md).

### Uso

```yalm
packages:
  # scoped packages
  '@scope/*':
    access: all
    publish: all
    proxy: server2

  'private-*':
    access: all
    publish: all
    proxy: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    access: all
    publish: all
    proxy: uplink2
```

si ninguno esta especificado, por defecto uno se define

```yaml
packages:
  '**':
     access: all
     publish: $authenticated
```

La lista de grupos validos de acuerdo a la extensión por defecto son

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

All users recieve all those set of permissions independently of is anonymous or not plus the groups provided by the plugin, in case of `htpasswd` return the username as a group. Por ejemplo, si has iniciado sesión como ` npmUser` el listado de grupos será.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

If you want to protect specific set packages under your group, you need to do something like this. Vamos a usar un `Regex` que cubre los todos los páquetes prefijos con`npmuser-`. We recomend using a prefix for your packages, in that way it will be easier to protect them.

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

Puedes cambiar el comportamiento por defecto usando una diferente extensión de autenticación. `verdaccio` just checks whether the user that tried to access or publish a specific package belongs to the right group.

#### Definir múltiples grupos

Defining multiple access groups is fairly easy, just define them with a white space between them.

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

If you want to block the acccess/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
     access: all
     publish: $authenticated
```

#### Bloqueando proxy a un grupo específico de paquetes

You might want to block one or several packages from fetching from remote repositories., but, at the same time, allow others to access different *uplinks*.

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
     access: all
     publish: $authenticated
     proxy: npmjs
```

Let's describe what we want with the above example:

* Quiero almacenar mi propia dependencia ` jquery` pero necesito evitar que se busque en el proxy.
* Quiero que todas mis dependencias que coincidan con `my-company-*` pero necesito evitar que dichos paquetes se actualicen vía proxy.
* I want all dependencies that are in the `my-local-scope` scope but I need to avoid proxying them.
* I want proxying for all the rest of the dependencies.

Se **consciente que el orden de la definición de los paquetes es importante y siempre usa doble wildcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

### Configuración

Puedes definir multiples `paquetes`y cada uno de ellos deben tener un único ` Regex`.

| Propiedad | Tipo    | Requerido | Ejemplo        | Soporte | Descripción                                                |
| --------- | ------- | --------- | -------------- | ------- | ---------------------------------------------------------- |
| access    | string  | No        | $all           | all     | define que grupos estan permitidos para acceder al paquete |
| publish   | string  | No        | $authenticated | all     | defini que grupos estan permitidos a publicar              |
| proxy     | string  | No        | npmjs          | all     | limita las busquedas a un uplink específico                |
| storage   | boolean | No        | [true,false]   | all     | TODO                                                       |

> We higlight that we recommend to not use **allow_access**/**allow_publish** and **proxy_access** anymore, those are deprecated and will soon be removed, please use the short version of each of those (**access**/**publish**/**proxy**).