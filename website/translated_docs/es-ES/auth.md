---
id: authentication
title: "Autenticación"
---

The authentication is tied to the auth [plugin](plugins.md) you are using. The package restrictions are also handled by the [Package Access](packages.md).

The client authentication is handled by the `npm` client itself. Once you log in to the application:

```bash
npm adduser --registry http://localhost:4873
```

Un toquen es generado en el archivo de configuración de `npm` alojado en el folder de usuario de tu máquina. Para mas información sobre `.npmrc`lea [la documentación oficial](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Publicar anónimamente

`verdaccio` allows you to enable anonymous publish. To achieve that you will need to correctly set up your [packages access](packages.md).

Por ejemplo:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Como se describe en [el ticket #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) hasta la versión de `pm@5.3.0` y todas las versiones menores **no permitirán publicar sin un token**.

## Entendiendo los Grupos

### El significado de `$all` y `$anonymous`

As you know *Verdaccio* uses `htpasswd` by default. Dicha extensión no implementa los métodos `allow_access`, `allow_publish` ni `allow_unpublish`. En consecuencia, *Verdaccio* manejará eso de la siguiente manera:

* Si tú no iniciaste sesión (eres anónimo), `$all` y `$anonymous` significarán exactamente lo mismo.
* If you are logged in, `$anonymous` won't be part of your groups and `$all` will match any logged user. A new group `$authenticated` will be added to your group list.

Please note: `$all` **will match all users, whether logged in or not**.

**El comportamiento anterior solo aplica a la extensión de autenticación por defecto**. Si tú estás usando una extensión personalizada y dicha extensión implementa `allow_access`, `allow_publish` o `allow_unpublish`, la resolución del acceso dependerá de dicha extensión. Verdaccio establecerá solamente los grupos por defecto.

Entonces recapitulando:

* **logged in**: `$all` and `$authenticated` + groups added by the plugin.
* **logged out (anonymous)**: `$all` and `$anonymous`.

## Htpasswd por defecto

In order to simplify the setup, `verdaccio` uses a plugin based on `htpasswd`. Since version v3.0.x the `verdaccio-htpasswd` plugin is used by default.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Propiedad | Tipo   | Requerido | Ejemplo    | Soporte | Descripción                                    |
| --------- | ------ | --------- | ---------- | ------- | ---------------------------------------------- |
| file      | string | Si        | ./htpasswd | all     | archivo que aloja las credenciales encriptadas |
| max_users | number | No        | 1000       | all     | limita los usuarios que pueden registrarse     |

In case you decide to prevent users from signing up themselves, you can set `max_users: -1`.