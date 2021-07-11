---
id: webui
title: "Interfaccia Utente Web"
---

![Uplink](https://user-images.githubusercontent.com/558752/52916111-fa4ba980-32db-11e9-8a64-f4e06eb920b3.png)

Verdaccio has a web user interface to display only the private packages and can be customised to your liking.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: http://somedomain/somelogo.png
  primary_color: "#4b5e40"
  gravatar: true | false
  scope: "@scope"
  sort_packages: asc | desc
  darkMode: false
  favicon: http://somedomain/favicon.ico | /path/favicon.ico
```

Tutte le restrizioni di accesso definite per [proteggere i pacchetti](protect-your-dependencies.md) si applicano anche all'interfaccia Web.

> The `primary_color` and `scope` must be wrapped by quotes: eg: ('#000000' or "#000000")

The `primary_color` **must be a valid hex representation**.

### Internationalization

*Since v4.5.0*, there are translations available.

```yaml
i18n:
  web: en-US
```

> ⚠️ Only the languages in this [list](https://github.com/verdaccio/ui/tree/master/i18n/translations) are available, feel free to contribute with more. The default one is en-US

### Configurazione

| Proprietà     | Tipo               | Richiesto | Esempio                                                       | Supporto      | Descrizione                                                                                                                                                      |
| ------------- | ------------------ | --------- | ------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable        | variabile booleana | No        | vero/falso                                                    | tutti         | abilita l'interfaccia web                                                                                                                                        |
| title         | stringa            | No        | Verdaccio                                                     | tutti         | Descrizione del titolo HTML                                                                                                                                      |
| gravatar      | variabile booleana | No        | vero                                                          | `>v4`      | Se questa proprietà viene abilitata, internamente verranno generati dei gravatar                                                                                 |
| sort_packages | [asc,desc]         | No        | asc                                                           | `>v4`      | Di default i pacchetti privati sono ordinati in ordine crescente                                                                                                 |
| logo          | stringa            | No        | `/local/path/to/my/logo.png` `http://my.logo.domain/logo.png` | tutti         | un URI in cui si trova il logo (logo intestazione)                                                                                                               |
| primary_color | stringa            | No        | "#4b5e40"                                                     | `>4`       | Il colore primario da utilizzare in tutta la IU (intestazione, ecc.)                                                                                             |
| scope         | stringa            | No        | @myscope                                                      | `>v3.x`    | Se si utilizza questo registro per uno specifico module scope, definire tale scope per impostarlo nell'intestazione delle istruzioni dell'interfaccia web utente |
| darkMode      | variabile booleana | No        | false                                                         | `>=v4.6.0` | This mode is an special theme for those want to live in the dark side                                                                                            |
| favicon       | stringa            | No        | false                                                         | `>=v5.0.1` | Display a custom favicon, can be local resource or valid url                                                                                                     |

> The recommended logo size is `40x40` pixels.
> 
> The `darkMode` can be enabled via UI and is persisted in the browser local storage. Furthermore, also void `primary_color` and dark cannot be customized.