---
id: authentification
title: "Authentification"
---
Les paramètres de la section d’authentification sont étroitement liés au [ plug-in ](plugins.md) "" Auth " que vous utilisez. Les restrictions d'accès aux packages sont également contrôlées via les [ autorisations d'accès aux packages ](packages.md).

Le processus d'authentification du client est géré par `npm` lui-même. Une fois que vous êtes connectés à l'application:

```bash
npm adduser --registry http://localhost:4873
```

Un jeton est généré dans le fichier de configuration `npm` hébergé dans votre répertoire personnel. Pour plus d'informations sur `.npmrc` lire la [documentation officielle](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Publication anonyme

`verdaccio`allows you to enable anonymous publish, to achieve that you will need to set up correctly your [packages access](packages.md).

Eg:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**. However `yarn` has not such limitation.

## Default htpasswd

In order to simplify the setup, `verdaccio` use a plugin based on `htpasswd`. As of version v3.0.x an [external plugin](https://github.com/verdaccio/verdaccio-htpasswd) is used by default. The v2.x version of this package still contains the built-in version of this plugin.

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