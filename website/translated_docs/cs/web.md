---
id: webui
title: "Webové uživatelské rozhraní"
---

![Uplinks](https://user-images.githubusercontent.com/558752/52916111-fa4ba980-32db-11e9-8a64-f4e06eb920b3.png)

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

Všechna omezení přístupu definovaná v [ochraně balíčků](protect-your-dependencies.md) se budou vztahovat také na webové rozhraní.

> The `primary_color` and `scope` must be wrapped by quotes: eg: ('#000000' or "#000000")

The `primary_color` **must be a valid hex representation**.

### Internationalization

*Since v4.5.0*, there are translations available.

```yaml
i18n:
  web: en-US
```

> ⚠️ Only the languages in this [list](https://github.com/verdaccio/ui/tree/master/i18n/translations) are available, feel free to contribute with more. The default one is en-US

### Konfigurace

| Vlastnost     | Typ        | Požadované | Příklad                                                       | Podpora       | Popis                                                                                                                    |
| ------------- | ---------- | ---------- | ------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| enable        | boolean    | Ne         | true/false                                                    | všechny       | povolit zobrazení webového rozhraní                                                                                      |
| title         | řetězec    | Ne         | Verdaccio                                                     | všechny       | Popis názvu hlavičky HTML                                                                                                |
| gravatar      | boolean    | Ne         | true                                                          | `>v4`      | Gravatary budou vygenerovány pod kapotou, pokud je tato vlastnost povolena                                               |
| sort_packages | [asc,desc] | Ne         | asc                                                           | `>v4`      | Ve výchozím nastavení jsou soukromé balíčky seřazeny vzestupně                                                           |
| logo          | řetězec    | Ne         | `/local/path/to/my/logo.png` `http://my.logo.domain/logo.png` | všechny       | uRI, kde se nachází logo (logo hlavičky)                                                                                 |
| primary_color | řetězec    | Ne         | "#4b5e40"                                                     | `>4`       | The primary color to use throughout the UI (header, etc)                                                                 |
| scope         | řetězec    | Ne         | @myscope                                                      | `>v3.x`    | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header |
| darkMode      | boolean    | Ne         | false                                                         | `>=v4.6.0` | This mode is an special theme for those want to live in the dark side                                                    |
| favicon       | řetězec    | Ne         | false                                                         | `>=v5.0.1` | Display a custom favicon, can be local resource or valid url                                                             |

> The recommended logo size is `40x40` pixels.
> 
> The `darkMode` can be enabled via UI and is persisted in the browser local storage. Furthermore, also void `primary_color` and dark cannot be customized.