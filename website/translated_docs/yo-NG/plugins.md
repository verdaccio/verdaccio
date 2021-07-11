---
id: awọn ohun elo
title: "Awọn ohun elo"
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

* [Ifasẹsi](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Ibi ipamọ](plugin-storage.md)
* Custom Theme and filters

> Ti o ba nifẹ lati se agbedide asomọ ti ara rẹ, ka [abala](dev-plugins.md) agbedide.

## Ilo

### Ifi sori ẹrọ

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` as a sinopia fork it has backward compability with plugins that are compatible with `sinopia@1.4.0`. In such case the installation is the same.

```
$> npm install --global sinopia-memory
```

### Iṣeto

Sii faili `config.yaml` ki o si ṣe imudojuiwọn abala `auth` naa bi atẹle yi:

Iṣeto atilẹwa naa dabi iru eyi, nitoripe a lo ohun elo alakọmọ `htpasswd` ni atilẹwa pe ki o le yọ kuro nipa yiyọ awọn ila wọnyi.


### Iṣeto Ifasẹsi

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

ati rirọpo wọn pẹlu (toba sẹlẹ pe o pinnu lati lo ohun elo `ldap`.

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Awọn ohun elo Ifasẹsi ọlọpọlọpọ

This is technically possible, making the plugin order important, as the credentials will be resolved in order.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    #max_users: 1000
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

### Iṣeto Middleware

This is an example how to set up a middleware plugin. All middleware plugins must be defined in the **middlewares** namespace.

```yaml
middlewares:
  audit:
    enabled: true
```

> O le tẹle [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) bi apẹẹrẹ ipilẹ.

### Iṣeto Ibi ipamọ

This is an example how to set up a storage plugin. All storage plugins must be defined in the **store** namespace.

```yaml
store:
  memory:
    limit: 1000
```

### Iṣeto Akori

Verdaccio allows to replace the User Interface with a custom one, we call it **theme**. Ni atilẹwa, o n lo `@verdaccio/ui-theme` ti o ba wa lati ilẹ, ṣugbọn, o le lo ohun ti o yatọ lati fi ohun asomọ ti ara rẹ sori ẹrọ.

```bash

$> npm install --global verdaccio-theme-dark

```

> Orukọ iṣaaju ohun asomọ naa gbọdọ bẹrẹ pẹlu `verdaccio-theme`, bibẹkọ ohun asomọ naa koni ṣiṣẹ.


You can load only one theme at a time and pass through options if you need it.

```yaml
theme:
  dark:
    option1: foo
    option2: bar
```

## Awọn ohun elo Ijogun

### Awọn ohun elo Sinopia

> Ti o ba ni igbarale lori eyikeyi ohun elo sinopia kankan, ranti pe adinku ti ba iwulo wọn atipe wọn le ma sisẹ mọ lọjọ iwaju.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): ohun elo ifasẹsi fun sinopia to n ṣe atilẹyin ibi iforukọsilẹ npm kan.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): ohun elo ifasẹsi fun sinopia ti o n se itọju awọn olumulo sinu iranti.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli)。.
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): ohun elo ifasẹsi fun sinopia to n ṣe atilẹyin atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): Ohun elo ifasẹsi Active Directory fun sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): ohun elo ifasẹsi fun sinopia2, to n ṣe atilẹyin github oauth web flow.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): Ohun elo ifasẹsi Sinopia ti o n ṣe atunpin ifasẹsi si HTTP URL miran
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Ohun elo ifasẹsi LDAP Miiran fun Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Ohun elo-ifasẹsi to rọrun ati to kun pẹlu iṣeto lati lo API ita kan.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Pilẹṣẹ ọrọ igbaniwọle ni ilana htaccess, pa ni aroko pẹlu GPG ki o si firanṣẹ nipasẹ MailGun API si awọn olumulo.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Ohun elo-ifasẹsi to rọrun ati to kun pẹlu iṣeto lati lo ibi ipamọ data mongodb.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): ohun elo ifasẹsi fun sinopia to n ṣe atilẹyin ilana htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): ohun elo ifasẹsi to ni atilẹyin leveldb fun sinopia private npm.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): Ohun elo ifasẹsi Gitlab fun sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): Ohun elo ifasẹsi Gitlab fun sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): Ohun elo ifasẹsi LDAP fun sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) Ohun elo ifasẹsi Sinopia pẹlu github oauth web flow.

> Gbogbo awọn ohun elo sinopia gbọdọ ni ibaramu pẹlu gbogbo awọn ẹya ọjọ iwaju verdaccio. Anyhow, we encourage contributors to migrate them to the modern verdaccio API and using the prefix as *verdaccio-xx-name*.

