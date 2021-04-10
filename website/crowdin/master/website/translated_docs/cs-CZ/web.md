---
id: webui
title: "Webové uživatelské rozhraní"
---

![Uplinks](https://user-images.githubusercontent.com/558752/52916111-fa4ba980-32db-11e9-8a64-f4e06eb920b3.png)

Verdaccio má webové uživatelské rozhraní pro zobrazení pouze soukromých balíčků a lze je přizpůsobit.

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

Všechna omezení přístupu definovaná v [ochraně balíčků](protect-your-dependencies.md) se budou vztahovat také na webové rozhraní.

### Konfigurace

| Vlastnost     | Typ        | Požadované | Příklad                                                       | Podpora    | Popis                                                                                                                    |
| ------------- | ---------- | ---------- | ------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| enable        | boolean    | Ne         | true/false                                                    | všechny    | povolit zobrazení webového rozhraní                                                                                      |
| title         | řetězec    | Ne         | Verdaccio                                                     | všechny    | Popis názvu hlavičky HTML                                                                                                |
| gravatar      | boolean    | Ne         | true                                                          | `>v4`   | Gravatary budou vygenerovány pod kapotou, pokud je tato vlastnost povolena                                               |
| sort_packages | [asc,desc] | Ne         | asc                                                           | `>v4`   | Ve výchozím nastavení jsou soukromé balíčky seřazeny vzestupně                                                           |
| logo          | řetězec    | Ne         | `/local/path/to/my/logo.png` `http://my.logo.domain/logo.png` | všechny    | uRI, kde se nachází logo (logo hlavičky)                                                                                 |
| primary_color | řetězec    | Ne         | "#4b5e40"                                                     | `>4`    | The primary color to use throughout the UI (header, etc)                                                                 |
| scope         | řetězec    | Ne         | @myscope                                                      | `>v3.x` | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header |

> Doporučuje se, aby velikost loga měla velikost `40x40` pixelů.