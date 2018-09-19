---
id: pacchetti
title: "Accesso al pacchetto"
---
È una serie di restrizioni che permettono o limitano l'accesso all'archiviazione locale basandosi su criteri specifici.

Le restrizioni di sicurezza dipendono dal plugin che si sta utilizzando, `verdaccio` usa di default il [plugin htpasswd](https://github.com/verdaccio/verdaccio-htpasswd). Se si usa un plugin differente il funzionamento potrebbe essere diverso. Il plugin predefinito non gestisce direttamente `allow_access` e `allow_publish`, ma utilizza un'alternativa interna nel caso in cui il plugin non sia pronto per questo.

Per ulteriori informazioni sui permessi, visita [la sezione autenticazione nella wiki](auth.md).

### Utilizzo

```yalm
packages:
  # scoped packages
  '@scope/*':
    access: all
    publish: all
    proxy: server2

  'private-*':
    access: all
    publish: all
    proxy: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    access: all
    publish: all
    proxy: uplink2
```

se non ne viene specificato nemmeno uno, rimane quello predefinito

```yaml
packages:
  '**':
     access: all
     publish: $authenticated
```

La lista di gruppi validi a seconda dei plugin predefiniti è

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

Tutti gli utenti ricevono tutti questi gruppi di permessi indipendentemente dal fatto che siano anonimi o no, più i gruppi previsti dal plugin, nel caso `htpasswd` respinga lo username come un gruppo. Per esempio, se si è loggati come `npmUser` l'elenco dei nomi sarà.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Se si desidera proteggere un insieme specifico di pacchetti dentro al tuo gruppo, è necessario fare qualcosa simile a questo. Utilizziamo un `Regex` che copra tutti i pacchetti con prefisso `npmuser-`. Raccomandiamo di utilizzare un prefisso per i pacchetti, in modo che possa essere più semplice proteggerli.

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

#### Blocking access to set of packages

If you want to block the acccess/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
     access: all
     publish: $authenticated
```

#### Blocking proxying a set of specific packages

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
     access: all
     publish: $authenticated
     proxy: npmjs
```

Let's describe what we want with the above example:

* I want to host my own `jquery` dependency but I need to avoid proxying it.
* I want all dependencies that match with `my-company-*` but I need to avoid proxying them.
* I want all dependencies that are in the `my-local-scope` scope but I need to avoid proxying them.
* I want proxying for all the rest of the dependencies.

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