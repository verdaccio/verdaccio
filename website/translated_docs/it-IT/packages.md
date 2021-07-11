---
id: packages
title: "Accesso ai Pacchetti"
---

This is a series of constraints that allow or restrict access to the local storage based on specific criteria.

Le restrizioni di sicurezza dipendono dal plugin che si sta utilizzando, `verdaccio` usa di default il [plugin htpasswd](https://github.com/verdaccio/verdaccio-htpasswd). Se si usa un plugin differente il funzionamento potrebbe essere diverso. Il plugin predefinito non gestisce direttamente `allow_access` e `allow_publish`, ma utilizza un'alternativa interna nel caso in cui il plugin non sia pronto per questo.

Per ulteriori informazioni sui permessi, visita [la sezione autenticazione nella wiki](auth.md).

### Utilizzo

```yalm
packages:
  # pacchetti con scope
  '@scope/*':
    access: $all
    publish: $all
    proxy: server2

  'private-*':
    access: $all
    publish: $all
    proxy: uplink1

  '**':
    # consenti a tutti gli utenti (inclusi quelli non autenticati) di leggere e
    # pubblicare tutti i pacchetti
    access: $all
    publish: $all
    proxy: uplink2
```

se non ne viene specificato nemmeno uno, rimane quello predefinito

```yaml
packages:
  '**':
    access: $all
    publish: $authenticated
```

Ecco l'elenco dei gruppi interni gestiti da `verdaccio`:

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

Tutti gli utenti ricevono tutti questi gruppi di permessi indipendentemente dal fatto che siano anonimi o no, più i gruppi previsti dal plugin, nel caso `htpasswd` respinga lo username come un gruppo. Per esempio, se si è loggati come `npmUser` l'elenco dei nomi sarà.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Se si desidera proteggere un insieme specifico di pacchetti dentro al proprio gruppo, è necessario fare qualcosa simile a questo. Utilizziamo un `Regex` che copra tutti i pacchetti con prefisso `npmuser-`. Raccomandiamo di utilizzare un prefisso per i pacchetti, in modo che possa essere più semplice proteggerli.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Riavviare `verdaccio` e provare ad installare `npmuser-core` nella console.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

È possibile modificare la condotta esistente utilizzando un plugin di autenticazione differente. `verdaccio` verifica semplicemente che l'utente che ha provato ad accedere o pubblicare un pacchetto specifico appartenga al gruppo corretto.

Please note that if you set the `access` permission of a package to something that requires Verdaccio to check your identity, for example `$authenticated`, npm does not send your access key by default when fetching packages. This means all requests for downloading packages will be rejected as they are made anonymously even if you have logged in. To make npm include you access key with all requests, you should set the [always-auth](https://docs.npmjs.com/cli/v7/using-npm/config#always-auth) npm setting to true on any client machines. This can be accomplished by running:

```bash
$ npm config set always-auth=true
```

#### Definire gruppi multipli

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

#### Bloccare l'accesso a gruppi di pacchetti

If you want to block the access/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Bloccare l'inoltro di un gruppo di pacchetti specifici

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

* Desidero ospitare la mia dipendenza `jquery` ma ho necessità di evitare il suo inoltro.
* Desidero tutte le dipendenze che coincidano con `my-company-*` ma ho necessità di evitare di inoltrarle.
* Desidero tutte le dipendenze che si trovino nell'ambito `my-local-scope` ma ho necessità di evitare di inoltrarle.
* Desidero l'inoltro per tutte le dipendenze rimanenti.

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

#### Use multiple uplinks

You may assign multiple uplinks for use as a proxy to use in the case of failover, or where there may be other private registries in use.

```yaml
'**':
  access: $all
  publish: $authenticated
  proxy: npmjs uplink2
```

#### Rimozione di Pacchetti Pubblicati

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

* tutti gli utenti possono pubblicare il pacchetto `jquery`, tuttavia solo l'utente `root` potrebbe annullare la pubblicazione di ogni versione.
* solo gli utenti autenticati possono pubblicare i pacchetti `my-company-*`, tuttavia **nessuno sarebbe autorizzato ad annullare la loro pubblicazione**.
* Se `unpublish` è commentato, l'accesso verrà garantito o negato dalla definizione di `publish`.


### Configurazione

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Proprietà     | Tipo    | Richiesto | Esempio        | Supporto       | Descrizione                                                                                      |
| ------------- | ------- | --------- | -------------- | -------------- | ------------------------------------------------------------------------------------------------ |
| accesso       | stringa | No        | $all           | tutti          | definisce i gruppi autorizzati ad accedere al pacchetto                                          |
| pubblicazione | stringa | No        | $authenticated | tutti          | definisce i gruppi autorizzati a pubblicare                                                      |
| proxy         | stringa | No        | npmjs          | tutti          | limita le ricerche di un uplink specifico                                                        |
| archiviazione | stringa | No        | stringa        | `/some-folder` | crea una sottocartella all'interno della cartella di archiviazione per ogni accesso ai pacchetti |

> Vogliamo rimarcare che non raccomandiamo più l'utilizzo di **allow_access**/**allow_publish** e **proxy_access** che sono superati e saranno presto rimossi, si prega di utilizzare invece la versione breve di ognuna di queste (**access**/**publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).
