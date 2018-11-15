---
id: webui
title: "Interfaccia utente web"
---


<p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

Verdaccio offre un'interfaccia web utente per mostrare solo i pacchetti privati e può essere personalizzata,.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

Tutte le restrizioni di accesso definite per [proteggere i pacchetti](protect-your-dependencies.md) si applicano anche all'interfaccia Web.

### Configurazione

| Proprietà | Tipo               | Richiesto | Esempio                        | Supporto | Descrizione                                                                                                                                                                |
| --------- | ------------------ | --------- | ------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable    | variabile booleana | No        | vero/falso                     | tutti    | abilita l'interfaccia web                                                                                                                                                  |
| title     | stringa            | No        | Verdaccio                      | tutti    | Descrizione del titolo HTML                                                                                                                                                |
| logo      | stringa            | No        | http://my.logo.domain/logo.png | tutti    | un URI in cui si trova il logo                                                                                                                                             |
| scope     | stringa            | No        | \\@myscope                   | tutti    | Se si utilizza questo registro per uno specifico scope, definisci quello scope nelle istruzioni dell' intestazione dell'interfaccia web utente (nota: escape @ with \\@) |