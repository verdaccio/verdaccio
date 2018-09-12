---
id: webui
title: "Utente Web Interface2"
---


<p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

Verdaccio has a web user interface to display only the private packages and can be customisable.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

Tutte le restrizioni di accesso definite per [proteggere i pacchetti](protect-your-dependencies.md) si applicano anche all'interfaccia Web.

### Configurazione

| Property | Tipo    | Richiesto | Esempio                        | Supporto | Descrizione                                                                                                                                          |
| -------- | ------- | --------- | ------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable   | boolean | No        | true/false                     | all      | abilita l'interfaccia web                                                                                                                            |
| title    | string  | No        | Verdaccio                      | all      | Descrizione del titolo HTML                                                                                                                          |
| logo     | string  | No        | http://my.logo.domain/logo.png | all      | un URI in cui si trova il logo                                                                                                                       |
| scope    | string  | No        | \\@myscope                   | all      | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header (note: escape @ with \\@) |