---
id: webui
title: "Intafeesi Olumulo ti Ayelujara"
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

Gbogbo awọn idena wiwọle ti o jẹ siseto[dabobo awọn akopọ rẹ](protect-your-dependencies.md) naa yoo jẹ sisamulo si Intafeesi Ayelujara naa.

> The `primary_color` and `scope` must be wrapped by quotes: eg: ('#000000' or "#000000")

The `primary_color` **must be a valid hex representation**.

### Internationalization

*Since v4.5.0*, there are translations available.

```yaml
i18n:
  web: en-US
```

> ⚠️ Only the languages in this [list](https://github.com/verdaccio/ui/tree/master/i18n/translations) are available, feel free to contribute with more. The default one is en-US

### Iṣeto

| Ohun ini      | Iru        | Ti o nilo | Apẹẹrẹ                                                        | Atilẹyin      | Apejuwe                                                                                                          |
| ------------- | ---------- | --------- | ------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| muṣiṣẹ        | boolean    | Rara      | otitọ/irọ                                                     | gbogbo        | gba lati ṣafihan intafeesi ayelujara naa                                                                         |
| akọle         | okun       | Rara      | Verdaccio                                                     | gbogbo        | Apejuwe akọle akori HTML                                                                                         |
| gravatar      | boolean    | Rara      | otitọ                                                         | `>v4`      | Gravatars yoo jẹ pipilẹṣẹ labẹ ibori ti o ba jẹ pe ohun-ini yii wa ni imusisẹ                                    |
| sort_packages | [asc,desc] | Rara      | asc                                                           | `>v4`      | Nipa atilẹwa awọn akopọ aladani ti jẹ siseto lẹsẹsẹ ni ọna igasoke                                               |
| logo          | okun       | Rara      | `/local/path/to/my/logo.png` `http://my.logo.domain/logo.png` | gbogbo        | uRI kan nibi ti aami idanimọ wa (akọle aami idanimọ)                                                             |
| primary_color | okun       | Rara      | "#4b5e40"                                                     | `>4`       | Awọ akọkọ lati lo jakejado UI naa(akọle, abbl)                                                                   |
| scope         | okun       | Rara      | @myscope                                                      | `>v3.x`    | Ti o ba n lo iforukọsilẹ yii fun scope modulu kan ni pato, yan scope naa lati ṣeto rẹ ninu akọle itọnisọna webui |
| darkMode      | boolean    | Rara      | false                                                         | `>=v4.6.0` | This mode is an special theme for those want to live in the dark side                                            |
| favicon       | okun       | Rara      | false                                                         | `>=v5.0.1` | Display a custom favicon, can be local resource or valid url                                                     |

> The recommended logo size is `40x40` pixels.
> 
> The `darkMode` can be enabled via UI and is persisted in the browser local storage. Furthermore, also void `primary_color` and dark cannot be customized.