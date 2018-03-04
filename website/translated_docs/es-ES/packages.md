---
id: packages
title: "Acceso a Paquetes"
---
Es una serie de restricciones que permiten o restringen el acceso al almacenamiento local basado en unos criterios específicos.

Las restricciones de seguridad dependen de la extensión usada, por defecto `verdaccio` usa la extensión ` htpasswd`. Si usas una extensión diferente ten en cuenta que el comportamiento podría ser diferente. La extensión por defecto ` htpasswd` no majena por si mismo ` allow_access` y ` allow_publish`, en se caso existe un manejador por defecto en caso que la extensión no este listo para ello. Para mas información sobre permisos visite [la sección de autenticación](auth.md).

### Uso

```yalm
packages:
  # scoped packages
  '@scope/*':
    allow_access: all
    allow_publish: all
    proxy: server2

  'private-*':
    access: all
    publish: all
    proxy_access: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    allow_access: all
    allow_publish: all
    proxy_access: uplink2
```

si ninguno es especificado, por defecto uno permanece activo

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

Todos los usuarios reciben una serie de permisos independientemente si es anónimo no grupos son delegados por la extensión, en caso de ` htpasswd` regresa el usuario como grupo. Por ejemplo, si inicias sesión como ` npmUser` la lista de grupos sera.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Si deseas proteger un grupo de paquetes específicos por un grupo, necesitarás hacer algo así. Vamos a usar un ` Regex` que cubre todos los paquetes prefijados `npmuser-`. Recomendamos user un prefijo para tus paquetes, en esa manera es mucho mas fácil protegerlos.

```yaml
packages:
  'npmuser-*':
     access: npmuser
     publish: npmuser
```

Reinicia ` verdaccio` y trata de instalar el paquete`npmuser-core`.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

Siempre puedes cambiar el comportamiento por defecto usando una diferente extensión de autenticación. ` verdaccio` verifica si el usuario trata de acceder o publicar un paquete específico pertenece al grupo correcto.

#### Definir múltiples grupos

Definir múltiples grupos es muy sencillo, solo define grupos con un espacio entre todos ellos.

```yaml
  'company-*':
    allow_access: admin internal
    allow_publish: admin
    proxy_access: server1
  'supersecret-*':
    allow_access: secret super-secret-area ultra-secret-area
    allow_publish: secret ultra-secret-area
    proxy_access: server1

```

#### Bloqueando el acceso a paquetes

Si deseas bloquear el acceso/publicación a paquetes específicos. Solo, no definas ` access` y ` publish`.

```yaml
packages:
  'old-*':
  '**':
     access: all
     publish: $authenticated
```

### Configuración

Puedes definir múltiples ` packages` y en cada uno de ellos debes definir un único ` Regex `.

| Propiedad             | Tipo    | Requerido | Ejemplo        | Soporte | Descripción                                                |
| --------------------- | ------- | --------- | -------------- | ------- | ---------------------------------------------------------- |
| allow_access/access   | string  | No        | $all           | all     | define que grupos estan permitidos para acceder al paquete |
| allow_publish/publish | string  | No        | $authenticated | all     | defini que grupos estan permitidos a publicar              |
| proxy_access/proxy    | string  | No        | npmjs          | all     | limita las busquedas a un uplink específico                |
| storage               | boolean | No        | [true,false]   | all     | TODO                                                       |

Recomendamos no usar **allow_access**/**allow_publish** y **proxy_access** nunca mas, estan depreciados u se las versiones cortas (**access**/**publish**/**proxy**)