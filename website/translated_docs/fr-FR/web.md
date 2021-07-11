---
id: webui
title: "Interface d'Utilisateur Web"
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

Toutes les restrictions d'accès définies pour la [protection des pacquets](protect-your-dependencies.md) s'appliquent également à l'Interface Web.

> The `primary_color` and `scope` must be wrapped by quotes: eg: ('#000000' or "#000000")

The `primary_color` **must be a valid hex representation**.

### Internationalization

*Since v4.5.0*, there are translations available.

```yaml
i18n:
  web: en-US
```

> ⚠️ Only the languages in this [list](https://github.com/verdaccio/ui/tree/master/i18n/translations) are available, feel free to contribute with more. The default one is en-US

### Configuration

| Propriété     | Type                 | Obligatoire | Exemple                                                       | Soutien       | Description                                                                                                              |
| ------------- | -------------------- | ----------- | ------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| enable        | booléenne            | Non         | vrai/faux                                                     | tous          | permettre l’affichage de l’interface web                                                                                 |
| titre         | chaîne de caractères | Non         | Verdaccio                                                     | tous          | Description du titre HTML                                                                                                |
| gravatar      | booléenne            | Non         | vrai                                                          | `>v4`      | Gravatars will be generated under the hood if this property is enabled                                                   |
| sort_packages | [asc,desc]           | Non         | asc                                                           | `>v4`      | By default private packages are sorted by ascending                                                                      |
| logo          | chaîne               | Non         | `/local/path/to/my/logo.png` `http://my.logo.domain/logo.png` | tous          | a URI where logo is located (header logo)                                                                                |
| primary_color | chaîne               | Non         | "#4b5e40"                                                     | `>4`       | The primary color to use throughout the UI (header, etc)                                                                 |
| scope         | chaîne               | Non         | @myscope                                                      | `>v3.x`    | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header |
| darkMode      | booléenne            | Non         | false                                                         | `>=v4.6.0` | This mode is an special theme for those want to live in the dark side                                                    |
| favicon       | chaîne               | Non         | false                                                         | `>=v5.0.1` | Display a custom favicon, can be local resource or valid url                                                             |

> The recommended logo size is `40x40` pixels.
> 
> The `darkMode` can be enabled via UI and is persisted in the browser local storage. Furthermore, also void `primary_color` and dark cannot be customized.