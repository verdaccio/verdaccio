---
id: webui
title: "Web User Interface"
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

All access restrictions defined to [protect your packages](protect-your-dependencies.md) will also apply to the Web Interface.

> The `primary_color` and `scope` must be wrapped by quotes: eg: ('#000000' or "#000000")

The `primary_color` **must be a valid hex representation**.

### Internationalization

*Since v4.5.0*, there are translations available.

```yaml
i18n:
  web: en-US
```

> ⚠️ Only the languages in this [list](https://github.com/verdaccio/ui/tree/master/i18n/translations) are available, feel free to contribute with more. The default one is en-US

### Konfiguracja

| Właściwość    | Typ         | Wymagane | Przykład                                                      | Wsparcie      | Opis                                                                                                                     |
| ------------- | ----------- | -------- | ------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| enable        | boolean     | Nie      | true/false                                                    | wszystkie     | allow to display the web interface                                                                                       |
| title         | ciąg znaków | Nie      | Verdaccio                                                     | wszystkie     | HTML head title description                                                                                              |
| gravatar      | boolean     | Nie      | true                                                          | `>v4`      | Gravatars will be generated under the hood if this property is enabled                                                   |
| sort_packages | [asc,desc]  | Nie      | asc                                                           | `>v4`      | By default private packages are sorted by ascending                                                                      |
| logo          | ciąg znaków | Nie      | `/local/path/to/my/logo.png` `http://my.logo.domain/logo.png` | wszystkie     | a URI where logo is located (header logo)                                                                                |
| primary_color | ciąg znaków | Nie      | "#4b5e40"                                                     | `>4`       | The primary color to use throughout the UI (header, etc)                                                                 |
| scope         | ciąg znaków | Nie      | @myscope                                                      | `>v3.x`    | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header |
| darkMode      | boolean     | Nie      | false                                                         | `>=v4.6.0` | This mode is an special theme for those want to live in the dark side                                                    |
| favicon       | ciąg znaków | Nie      | false                                                         | `>=v5.0.1` | Display a custom favicon, can be local resource or valid url                                                             |

> The recommended logo size is `40x40` pixels.
> 
> The `darkMode` can be enabled via UI and is persisted in the browser local storage. Furthermore, also void `primary_color` and dark cannot be customized.