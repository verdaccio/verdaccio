---
id: authentification
title: "Authentification"
---
Les paramètres de la section d’authentification sont étroitement liés au [ plug-in ](plugins.md) "" Auth " que vous utilisez. Les restrictions d'accès aux packages sont également contrôlées via les [ autorisations d'accès aux packages ](packages.md).

Le processus d'authentification du client est géré par `npm` lui-même. Une fois que vous êtes connectés à l'application:

```bash
npm adduser --registry http://localhost:4873
```

Un jeton est généré dans le `npm` fichier de configuration hébergé dans votre répertoire personnel. Pour plus d'informations sur `.npmrc` lire la [documentation officielle](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Publication anonyme

`verdaccio` vous permet d'activer la publication anonyme. Pour utiliser cette fonction, vous devez définir correctement votre [accès aux packages](packages.md).

Eg:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**. Cependant `yarn` n'a pas une telle limitation.

## Htpasswd par défaut

Afin de simplifier la configuration, `verdaccio` utilise un plugin basé sur `htpasswd`. A partir de la version 3.0.x, le [ plugin externe ](https://github.com/verdaccio/verdaccio-htpasswd) est utilisé par défaut. The v2.x version of this package still contains the built-in version of this plugin.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Propriété | Type   | Required | Example    | Support | Description                                                     |
| --------- | ------ | -------- | ---------- | ------- | --------------------------------------------------------------- |
| file      | string | Yes      | ./htpasswd | all     | fichier qui héberge les informations d'identification chiffrées |
| max_users | nombre | N°       | 1000       | tous    | définir un nombre limit d'utilisateurs                          |

Si vous décidez d'empêcher un utilisateur de se connecter, vous pouvez définir `max_users: -1`.