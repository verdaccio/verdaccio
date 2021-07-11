---
id: webui
title: "Web User Interface"
---

![Uplinks](https://user-images.githubusercontent.com/558752/52916111-fa4ba980-32db-11e9-8a64-f4e06eb920b3.png)

<div id="codefund">''</div>

Verdaccio поседује прилагодиви веб кориснички интерфејс који приказује само приватне пакете.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  primary_color: "#4b5e40"
  gravatar: true | false
  scope: "@scope"
  sort_packages: asc | desc
```

Све рестрикције које се односе на приступ дефинисане су у оквиру  и такође ће се аплицирати и на веб интерфејс.</p> 

### Internationalization

*Since v4.5.0*, there are translations available

```yaml
i18n:
  web: en-US  
```

> ⚠️ Only the languages in this [list](https://github.com/verdaccio/ui/tree/master/i18n/translations) are available, feel free to contribute with more. The default one is es-US

### Конфигурисање

| Својство      | Тип        | Неопходно | Пример                                                        | Подршка       | Опис                                                                                                                     |
| ------------- | ---------- | --------- | ------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| enable        | boolean    | Не        | true/false                                                    | all           | дозвољава приказ веб интерфејса                                                                                          |
| title         | string     | Не        | Verdaccio                                                     | all           | Опис наслова HTML заглавља                                                                                               |
| gravatar      | boolean    | Не        | true                                                          | `>v4`      | Gravatar-и ће бити генерисани у позадини, ако је ово својство омогућено                                                  |
| sort_packages | [asc,desc] | Не        | asc                                                           | `>v4`      | По правилу, приватни пакети су сортирани по растућем редоследу                                                           |
| logo          | string     | Не        | `/local/path/to/my/logo.png` `http://my.logo.domain/logo.png` | all           | URI где се лого налази (лого за header)                                                                                  |
| primary_color | string     | Не        | "#4b5e40"                                                     | `>4`       | The primary color to use throughout the UI (header, etc)                                                                 |
| scope         | string     | Не        | @myscope                                                      | `>v3.x`    | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header |
| darkMode      | boolean    | Не        | false                                                         | `>=v4.5.2` | This mode is an special theme for those want to live in the dark side                                                    |

> Препоручено је да лого буде димензија `40x40` пиксела.
> 
> The `darMode` can be enbled via UI and is persisted in the local storage, furthermore, also void `primary_color` and dark cannot be customized.