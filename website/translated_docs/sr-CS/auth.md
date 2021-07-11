---
id: authentication
title: "Authentication"
---

The authentication is tied to the auth [plugin](plugins.md) you are using. The package restrictions are also handled by the [Package Access](packages.md).

The client authentication is handled by the `npm` client itself. Once you log in to the application:

```bash
npm adduser --registry http://localhost:4873
```

Token se generiše u fajlu za konfiguraciju `npm`, koji se nalazi u home folder-u korisnika. Kako biste saznali više o `.npmrc` pročitajte [zvaničnu dokumentaciju](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Anonimno publikovanje

`verdaccio` allows you to enable anonymous publish. To achieve that you will need to correctly set up your [packages access](packages.md).

Primer:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Kao što je opisano, [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) sve dok `npm@5.3.0` i sve verzije ne budu usaglašene **neće Vam biti omogućeno da publikujete bez tokena**.

## Understanding Groups

### The meaning of `$all` and `$anonymous`

As you know *Verdaccio* uses `htpasswd` by default. That plugin does not implement the methods `allow_access`, `allow_publish` and `allow_unpublish`. Thus, *Verdaccio* will handle that in the following way:

* If you are not logged in (you are anonymous), `$all` and `$anonymous` means exactly the same.
* If you are logged in, `$anonymous` won't be part of your groups and `$all` will match any logged user. A new group `$authenticated` will be added to your group list.

Please note: `$all` **will match all users, whether logged in or not**.

**The previous behavior only applies to the default authentication plugin**. If you are using a custom plugin and such plugin implements `allow_access`, `allow_publish` or `allow_unpublish`, the resolution of the access depends on the plugin itself. Verdaccio will only set the default groups.

Let's recap:

* **logged in**: `$all` and `$authenticated` + groups added by the plugin.
* **logged out (anonymous)**: `$all` and `$anonymous`.

## Podrazumevana htpasswd

In order to simplify the setup, `verdaccio` uses a plugin based on `htpasswd`. Since version v3.0.x the `verdaccio-htpasswd` plugin is used by default.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maksimalni broj korisnika koji se može registovati, podrazumevano je beskonačno, "+inf".
    # Ovo možete podesiti na -1 kako biste onemogućili registrovanje.
    #max_users: 1000
```

| Svojstvo  | Tip    | Neophodno | Primer     | Podrška | Opis                                   |
| --------- | ------ | --------- | ---------- | ------- | -------------------------------------- |
| file      | string | Da        | ./htpasswd | all     | file koji sadrži šifrovane credentials |
| max_users | number | Ne        | 1000       | all     | podešava maksimalni broj korisnika     |

In case you decide to prevent users from signing up themselves, you can set `max_users: -1`.