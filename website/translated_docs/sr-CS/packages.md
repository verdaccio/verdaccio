---
id: packages
title: "Package Access"
---

This is a series of constraints that allow or restrict access to the local storage based on specific criteria.

Sigurnost pada na pleća plugina koji se koristi. Po pravilu, `verdaccio` koristi [htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd). Ako koristite različit plugin, način izvršavanja (behaviour) bi takođe mogao biti promenjen. Podrazumevani plugin ne rukovodi (handle) sa `allow_access` i `allow_publish` samostalno, već koristi interni fallback u slučaju da ne postoji spremni plugin.

Za više informacija o dozvolama, posetite [authentification sekciju na wiki](auth.md).

### Korišćenje

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

ako ništa nije precizirano, ostaje kako je podrazumevano

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

Svi korisnici primaju sve navedeno kako bi podesili ovlašćenja nezavisno od toga jesu li anonimna ili više grupa nije omogućeno od strane plugina, a u slučaju da je tako `htpasswd` vraća username kao grupu. Na primer, ako ste prijavljeni kao `npmUser` lista grupa će izgledati ovako.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Ako želite da zaštitite specifični set paketa u okviru grupe, potrebno je da uradite ovako nešto. Koristimo `Regex` koji pokriva sve `npmuser-` pakete sa prefiksima. Preporučujemo korišćenje prefiksa za Vaše pakete, jer ćete ih na taj način lakše zaštititi.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Restartujte `verdaccio` i u svojoj konzoli probajte da instalirate `npmuser-core`.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

Možete promeniti postojeći behaviour korišćenjem različite plugin autentifikacije. `verdaccio` proverava da li korisnik koji je pokušao da pristupi nekom paketu ili publikuje paket pripada ispravnoj grupi korisnika.

Please note that if you set the `access` permission of a package to something that requires Verdaccio to check your identity, for example `$authenticated`, npm does not send your access key by default when fetching packages. This means all requests for downloading packages will be rejected as they are made anonymously even if you have logged in. To make npm include you access key with all requests, you should set the [always-auth](https://docs.npmjs.com/cli/v7/using-npm/config#always-auth) npm setting to true on any client machines. This can be accomplished by running:

```bash
$ npm config set always-auth=true
```

#### Podešavanje multiplih grupa

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

#### Blokiranje pristupa setu paketa

If you want to block the access/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Blokiranje proxying-a za set specifičnih paketa

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

* Želim da hostujem svoj `jquery` dependency ali istovremeno želim da izbegnem njeno proxying-ovanje.
* Želim sve dependencies koje se poklapaju sa `my-company-*` ali ujedno imam potrebu da izbegnem njihovo proxying-ovanje.
* Želim sve dependencies koje su u `my-local-scope` ali ujedno želim da izbegnem njihovo proxying-ovanje.
* Želim da proxying-ujem sve ostale dependencies.

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


### Konfigurisanje

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Svojstvo | Tip    | Neophodno | Primer         | Podrška        | Opis                                                                |
| -------- | ------ | --------- | -------------- | -------------- | ------------------------------------------------------------------- |
| access   | string | Ne        | $all           | all            | definiše grupe kojima je dozvoljen pristup paketu                   |
| publish  | string | Ne        | $authenticated | all            | definiše grupe kojima je dozvoljeno da publikuju                    |
| proxy    | string | Ne        | npmjs          | all            | limitira look ups za specifični uplink                              |
| storage  | string | Ne        | string         | `/some-folder` | kreira pod-folder unutrar storage foldera za svaki pristup paketima |

> We higlight that we recommend to not use **allow_access**/**allow_publish** and **proxy_access** anymore, those are deprecated and will soon be removed, please use the short version of each of those (**access**/**publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).
