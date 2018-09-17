---
id: protect-your-dependencies
title: "Protezione dei pacchetti"
---
`verdaccio` permette di proteggere la pubblicazione. Per ottenere ciò è necessario configurare correttamente l'[accesso ai pacchetti](packages).

### Configurazione del pacchetto

Vediamo, per esempio, la seguente configurazione. Si dispone di una serie di dipendenze che hanno come prefisso `my-company-*` e si necessita di proteggerle da anonimi o da altri utenti loggati senza credenziali.

```yaml
  'my-company-*':
    access: admin teamA teamB teamC
    publish: admin teamA
    proxy: npmjs
```

With this configuration, basically we allow to groups **admin** and **teamA** to *publish* and **teamA** **teamB** **teamC** *access* to such dependencies.

### Caso d'uso: teamD prova ad accedere alla dipendenza

Quindi, se io sono loggato come **teamD** non dovrei poter accedere a tutte quelle dipendenze che corrispondono al modello `my-company-*`.

```bash
➜ npm whoami
teamD
```

Non solo non avrò accesso a tali dipendenze ma non saranno nemmeno visibili via web per l'utente **teamD**.

```bash
➜ npm install my-company-core
npm ERR! code E403
npm ERR! 403 Forbidden: webpack-1@latest
```

o con `yarn`

```bash
➜ yarn add my-company-core
yarn add v0.24.6
info No lockfile found.
[1/4] 
errore Si è verificato un errore imprevisto: "http://localhost:5555/webpack-1: gli utenti non registrati non sono autorizzati ad accedere al pacchetto my-company-core".
```