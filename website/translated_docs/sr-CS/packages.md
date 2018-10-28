---
id: packages
title: "Package Access"
---
Ovo je serija kontejnera koja dozvoljava ili zabranjuje pristup do ocal storage na osnovu specifično definisanih kriterijuma.

Sigurnost pada na pleća plugina koji se koristi. Po pravilu, `verdaccio` koristi [htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd). Ako koristite različit plugin, način izvršavanja (behaviour) bi takođe mogao biti promenjen. Podrazumevani plugin ne rukovodi (handle) sa `allow_access` i `allow_publish` samostalni, već koristi interni fallback u slučaju da ne postoji spremni plugin.

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

Lista validnih grupa u skladu sa podrazumevanim pluginima

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

#### Podešavanje multiplih grupa

Definisanje multiple access groups ej relativno jednostavno, samo je potrebno da ih definišete sa razmakom između.

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

Ako želite da blokirate pristup/publikovanje specifičnoj grupi paketa, samo izostavite da definišete `access` i `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Blokiranje proxying-a za set specifičnih paketa

Možda ćete poželeti da blokirate jedan ili više paketa od uhvaćenih (fetching) iz udaljenog repozitorijuma, ali da istovremeno dozvolite drugima da pristupe različitim *uplinks-ima*.

Hajde da pogledamo primer:

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

Hajde da vidimo šta smo postigli u navedenom primeru:

* Želim da hostujem svoj `jquery` dependency ali istovremeno želim da izbegnem njeno proxying-ovanje.
* Želim sve dependencies koje se poklapaju sa `my-company-*` ali ujedno imam potrebu da izbegnem njihovo proxying-ovanje.
* Želim sve dependencies koje su u `my-local-scope` ali ujedno želim da izbegnem njihovo proxying-ovanje.
* Želim da proxying-ujem sve ostale dependencies.

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

### Configuration

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Property | Type    | Required | Example        | Support | Description                                 |
| -------- | ------- | -------- | -------------- | ------- | ------------------------------------------- |
| access   | string  | No       | $all           | all     | define groups allowed to access the package |
| publish  | string  | No       | $authenticated | all     | define groups allowed to publish            |
| proxy    | string  | No       | npmjs          | all     | limit look ups for specific uplink          |
| storage  | boolean | No       | [true,false]   | all     | TODO                                        |

> We higlight that we recommend to not use **allow_access**/**allow_publish** and **proxy_access** anymore, those are deprecated and will soon be removed, please use the short version of each of those (**access**/**publish**/**proxy**).