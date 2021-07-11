---
id: plugins
title: "Plugin"
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

Sono presenti 5 tipi di plugin:

* [Autenticazione](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Archiviazione](plugin-storage.md)
* Custom Theme and filters

> Se sei interessato a sviluppare il tuo plugin personale, leggi la sezione [sviluppo](dev-plugins.md).

## Utilizzo

### Installazione

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` essendo un fork di sinopia ha retrocompatibilità con plugin che sono compatibili con `sinopia@1.4.0`. In tal caso l'installazione è la stessa.

```
$> npm install --global sinopia-memory
```

### Configurazione

Aprire il file `config.yaml` e aggiornare la sezione `auth` come segue:

La configurazione predefinita appare così, poiché usiamo un plugin `htpasswd` incorporato di default che si può disabilitare commentando le seguenti linee.


### Configurazione dell'Autenticazione

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

e sostituendo con (in caso si decida di utilizzare un plugin `ldap`.

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Plugin di Autenticazione Multipla

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

### Configurazione di Middleware

Questo è un esempio di come si configura un middleware plugin. Tutti i middleware plugin devono essere definiti nel **middlewares** namespace.

```yaml
middlewares:
  audit:
    enabled: true
```

> Si potrebbe seguire l'[audit middle plugin](https://github.com/verdaccio/verdaccio-audit) come esempio di base.

### Configurazione dell'Archiviazione

Questo è un esempio di come configurare un plugin di archiviazione. Tutti i plugin di archiviazione devono essere definiti nello **store** namespace.

```yaml
store:
  memory:
    limit: 1000
```

### Configurazione del Tema

Verdaccio consente di sostituire l'Interfaccia Utente con una personalizzata, che noi chiamiamo **tema**. Di default, utilizza `@verdaccio/ui-theme` che è integrato, tuttavia è possibile usare qualcosa di diverso installando il proprio plugin.

```bash

$> npm install --global verdaccio-theme-dark

```

> Il prefisso del nome del plugin deve cominciare con `verdaccio-theme`, altrimenti il plugin non caricherà.


You can load only one theme at a time and pass through options if you need it.

```yaml
theme:
  dark:
    option1: foo
    option2: bar
```

## Plugin ereditati

### Plugin di Sinopia

> Se si sta facendo affidamento su qualunque sinopia plugin, ricordare che sono deprecati e potrebbero non funzionare in futuro.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): plugin auth per il supporto di sinopia a un registro npm.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): plugin auth per sinopia che mantiene gli utenti in memoria.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): plugin auth per sinopia che supporta atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): Plugin di autenticazione Active Directory per sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): plugin di autenticazione per sinopia2, che supporta il flusso web di github oauth.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): plugin di autenticazione di Sinopia che delega autenticazione ad altro URL HTTP
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alterna il plugin LDAP Auth per Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Un plugin auth semplice e completo con la configurazione per utilizzare un'API esterna.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Genera password in formato htaccess, cripta con GPG ed invia attraverso MailGun API agli utenti.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Un plugin auth semplice e completo con la configurazione per utilizzare un database mongodb.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): plugin auth per sinopia che supporta il formato htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): plugin auth supportato da leveldb per l'npm privato di sinopia.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): plugin di autenticazione Gitlab per sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): plugin di autenticazione Gitlab per sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): plugin auth LDAP per sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) plugin di autenticazione di Sinopia con flusso web github oauth.

> Tutti i plugin di sinopia dovrebbero essere compatibili con tutte le versioni future di verdaccio. Tuttavia, incoraggiamo i contributori a spostarli sull'API attuale di verdaccio e ad utilizzare il prefisso così *verdaccio-xx-name*.

