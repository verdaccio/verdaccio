---
id: pakiety
title: "Dostęp do Pakietu"
---

This is a series of constraints that allow or restrict access to the local storage based on specific criteria.

Ograniczenia bezpieczeństwa pozostają na ramkach używanej wtyczki, domyślnie `verdaccio` używa [wtyczki htpasswd](https://github.com/verdaccio/verdaccio-htpasswd). Jeśli używasz innej wtyczki, zachowanie może być inne. Domyślna wtyczka nie obsługuje samodzielnie `allow_access` i `allow_publish`, korzysta z wewnętrznego mechanizmu zastępczego w przypadku, gdy wtyczka nie jest gotowa.

Aby uzyskać więcej informacji o uprawnieniach, odwiedź [sekcję uwierzytelniania na wiki](auth.md).

### Użycie

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

jeśli żadna nie jest określona, pozostaje domyślna

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

Wszyscy użytkownicy otrzymują wszystkie te zbiory uprawnień niezależnie od tego, czy są anonimowi, czy nie plus grupy zapewniane przez wtyczkę, w przypadku `htpasswd` zwracają nazwę użytkownika jako grupę. Na przykład, jeśli jesteś zalogowany jako `npmUser`, będzie to lista grup.

```js
// grupy bez '$' ostatecznie zostaną uznane za przestarzałe
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Jeśli chcesz chronić określone zestawy pakietów w swojej grupie, musisz zrobić coś takiego. Użyjmy `Regex`, który obejmuje wszystkie pakiety z prefiksem `npmuser-`. We recommend using a prefix for your packages, in that way it will be easier to protect them.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Zrestartuj `verdaccio` i w swojej konsoli spróbuj zainstalować `npmuser-core`.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! Kompletny dziennik tego przebiegu można znaleźć w: npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

Możesz zmienić istniejące zachowanie, korzystając z innego uwierzytelniania wtyczki. `verdaccio` po prostu sprawdza, czy użytkownik, który próbował uzyskać dostęp lub opublikował konkretny pakiet, należy do właściwej grupy.

Please note that if you set the `access` permission of a package to something that requires Verdaccio to check your identity, for example `$authenticated`, npm does not send your access key by default when fetching packages. This means all requests for downloading packages will be rejected as they are made anonymously even if you have logged in. To make npm include you access key with all requests, you should set the [always-auth](https://docs.npmjs.com/cli/v7/using-npm/config#always-auth) npm setting to true on any client machines. This can be accomplished by running:

```bash
$ npm config set always-auth=true
```

#### Ustaw wiele grup

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

#### Blokowanie dostępu do zestawu pakietów

If you want to block the access/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Blokowanie proxy dla zestawu określonych pakietów

You might want to block one or several packages from fetching from remote repositories., but, at the same time, allow others to access different *uplinks*.

Let's see the following example:

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

Let's describe what we want with the above example:

* Chcę hostować własną `jquery` zależność, ale muszę unikać proxy.
* I want all dependencies that match with `my-company-*` but I need to avoid proxying them.
* I want all dependencies that are in the `my-local-scope` scope but I need to avoid proxying them.
* I want proxying for all the rest of the dependencies.

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

#### Use multiple uplinks

You may assign multiple uplinks for use as a proxy to use in the case of failover, or where there may be other private registries in use.

```yaml
'**':
  access: $all
  publish: $authenticated
  proxy: npmjs uplink2
```

#### Unpublishing Packages

The property `publish` handle permissions for `npm publish` and `npm unpublish`.  But, if you want to be more specific, you can use the property `unpublish` in your package access section, for instance:

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


### Konfiguracja

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Właściwość | Typ         | Wymagane | Przykład       | Wsparcie       | Opis                                                                      |
| ---------- | ----------- | -------- | -------------- | -------------- | ------------------------------------------------------------------------- |
| access     | ciąg znaków | Nie      | $all           | wszystkie      | define groups allowed to access the package                               |
| publish    | ciąg znaków | Nie      | $authenticated | wszystkie      | define groups allowed to publish                                          |
| proxy      | ciąg znaków | Nie      | npmjs          | wszystkie      | limit look ups for specific uplink                                        |
| magazyn    | ciąg znaków | Nie      | ciąg znaków    | `/some-folder` | it creates a subfolder whithin the storage folder for each package access |

> Podkreślamy, że zalecamy niekorzystanie dłużej z **allow_access**/**allow_publish**i** proxy_access**, są one nieaktualne i wkrótce zostaną usunięte. Użyj skróconej wersji każdego z tych (**access**/**publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).
