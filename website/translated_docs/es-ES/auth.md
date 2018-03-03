---
id: authentification
title: "Autenticación"
---
La autenticación esta atada al [plugin](plugins.md) de autenticación que estes usando. Las restricciones de paquetes es manejado por el [maneador de acceso de paquetes](packages.md).

El cliente de autenticación es manejado por el cliente `npm` en su mismo. Una vez has iniciado sesión en la aplicación:

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

#### Anonymous publish

`verdaccio`allows you to enable anonymous publish, to achieve that you will need to set up correctly your [packages acces](packages.md).

Eg:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**. However `yarn` has not such limitation.

## Default htpasswd

In order to simplify the setup, `verdaccio` use a build-in plugin based on `htpasswd`.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Property  | Type   | Required | Example    | Support | Description                              |
| --------- | ------ | -------- | ---------- | ------- | ---------------------------------------- |
| file      | string | Yes      | ./htpasswd | all     | file that host the encrypted credentials |
| max_users | number | No       | 1000       | all     | set limit of users                       |

In case to decide do not allow user to login, you can set `max_users: -1`.