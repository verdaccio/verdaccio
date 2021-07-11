---
id: authentication
title: "Authentication"
---

The authentication is tied to the auth [plugin](plugins.md) you are using. The package restrictions are also handled by the [Package Access](packages.md).

The client authentication is handled by the `npm` client itself. Once you log in to the application:

```bash
npm adduser --registry http://localhost:4873
```

Token je vygenerovaný v konfiguračním souboru `npm` hostovaném ve Vaší domovské složce uživatele. Pro více informací o `.npmrc` si přečtěte [oficiální dokumentaci](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Anonymní publikování

`verdaccio` allows you to enable anonymous publish. To achieve that you will need to correctly set up your [packages access](packages.md).

Např.:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**.

## Principy skupin

### Význam `$all` a `$anonymous`

As you know *Verdaccio* uses `htpasswd` by default. Tento doplňek neimplementuje metody `allow_access`, `allow_publish` a `allow_unpublish`. Tím pádem bude *Verdaccio* řešit tyto případy následujícím způsobem:

* Pokud nejste přihlášení (jste anonymní), `$all` a `$anonymous` znamenají to samé.
* If you are logged in, `$anonymous` won't be part of your groups and `$all` will match any logged user. A new group `$authenticated` will be added to your group list.

Please note: `$all` **will match all users, whether logged in or not**.

**Výše popsané chování se vztahuje pouze na výchozí doplněk pro ověřovaní**. Pokud používáte vlastní doplněk a tento doplněk implementuje použití `allow_access`, `allow_publish` nebo `allow_unpublish`, řešení přístupu závisí na plugin samotném. Verdaccio nastaví pouze výchozí skupiny.

Rekapitulace:

* **logged in**: `$all` and `$authenticated` + groups added by the plugin.
* **logged out (anonymous)**: `$all` and `$anonymous`.

## Default htpasswd

In order to simplify the setup, `verdaccio` uses a plugin based on `htpasswd`. Since version v3.0.x the `verdaccio-htpasswd` plugin is used by default.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximální množství uživatelů, kteří se mohou registrovat, výchozí nastaveno na "+inf".
    # Můžete nastavit -1 pro zablokování registrací.
    #max_users: 1000
```

| Vlastnost | Typ     | Požadované | Příklad    | Podpora | Popis                                               |
| --------- | ------- | ---------- | ---------- | ------- | --------------------------------------------------- |
| file      | řetězec | Ano        | ./htpasswd | všechny | soubor, který obsahuje šifrované přihlašovací údaje |
| max_users | číslo   | Ne         | 1000       | všechny | nastavit limit uživatelů                            |

In case you decide to prevent users from signing up themselves, you can set `max_users: -1`.