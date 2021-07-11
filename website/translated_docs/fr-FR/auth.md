---
id: authentication
title: "Authentication"
---

The authentication is tied to the auth [plugin](plugins.md) you are using. The package restrictions are also handled by the [Package Access](packages.md).

The client authentication is handled by the `npm` client itself. Once you log in to the application:

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

`verdaccio` allows you to enable anonymous publish. To achieve that you will need to correctly set up your [packages access](packages.md).

Par exemple :

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Comme décrit [ dans le cas N°212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500)jusqu'à`npm@5.3.0`et dans toutes les versions mineurs ** vous ne serez pas autorisés à publier sans jeton**.

## Comprendre les groupes

### La signification de `$all` et `$anonymous`

As you know *Verdaccio* uses `htpasswd` by default. Ce plugin ne met pas en œuvre les méthodes `permettre_accès`, `permettre_publier` and `permettre_non publié`. Ainsi, *Verdaccio* traitera cette question de la manière suivante :

* Si vous n'êtes pas connecté (vous êtes anonyme),`$all` et `$anonymous` signifie exactement la même chose.
* If you are logged in, `$anonymous` won't be part of your groups and `$all` will match any logged user. A new group `$authenticated` will be added to your group list.

Please note: `$all` **will match all users, whether logged in or not**.

**Le comportement précédent ne s'applique qu'au plugin d'authentification par défaut**. If you are using a custom plugin and such plugin implements `allow_access`, `allow_publish` or `allow_unpublish`, the resolution of the access depends on the plugin itself. Verdaccio ne définira que les groupes par défaut.

Let's recap:

* **logged in**: `$all` and `$authenticated` + groups added by the plugin.
* **logged out (anonymous)**: `$all` and `$anonymous`.

## Htpasswd par défaut

In order to simplify the setup, `verdaccio` uses a plugin based on `htpasswd`. Since version v3.0.x the `verdaccio-htpasswd` plugin is used by default.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Propriété | Type   | Obligatoire | Exemple    | Soutien | Description                                                     |
| --------- | ------ | ----------- | ---------- | ------- | --------------------------------------------------------------- |
| fichier   | chaîne | Oui         | ./htpasswd | tous    | fichier qui héberge les informations d'identification chiffrées |
| max_users | numéro | Non         | 1000       | tous    | définir un nombre limite d'utilisateurs                         |

In case you decide to prevent users from signing up themselves, you can set `max_users: -1`.