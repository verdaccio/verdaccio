---
id: autentizace
title: "Autentizace"
---

Ověření je svázené s [doplňkem](plugins.md) pro ověření, který používáte. Omezení balíčků je též zpracování v [Přístupu k balíčkům](packages.md).

Ověření klienta provádí sám klient `npm`. Jakmile se přihlásíte do aplikace:

```bash
npm adduser --registry http://localhost:4873
```

Token je vygenerovaný v konfiguračním souboru `npm` hostovaném ve Vaší domovské složce uživatele. Pro více informací o `.npmrc` si přečtěte [oficiální dokumentaci](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Anonymní publikování

`Verdaccio` Vám umožňuje nastavit anonymní publikování. Abyste toho dosáhli, budete muset správně nastavit svůj [přístup k balíčkům](packages.md).

Např.:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**.

## Principy skupin

### Význam `$all` a `$anonymous`

Jak víte, *Verdaccio* používá ve výchozím nastavení `htpasswd`. Tento doplňek neimplementuje metody `allow_access`, `allow_publish` a `allow_unpublish`. Tím pádem bude *Verdaccio* řešit tyto případy následujícím způsobem:

* Pokud nejste přihlášení (jste anonymní), `$all` a `$anonymous` znamenají to samé.
* Pokud jste přihlášení, `$anonymous` nebude součástí Vaší skupiny a `$all` bude odpovídat jakémukoliv přihlášenému uživateli. Nová skupina `$authenticated` bude přidána do seznamu.

Nastavení `$all` **bude odpovídat všem uživatelům, přihlášeným i nepřihlášeným**.

**Výše popsané chování se vztahuje pouze na výchozí doplněk pro ověřovaní**. Pokud používáte vlastní doplněk a tento doplněk implementuje použití `allow_access`, `allow_publish` nebo `allow_unpublish`, řešení přístupu závisí na plugin samotném. Verdaccio nastaví pouze výchozí skupiny.

Rekapitulace:

* **logged**: `$all`, `$authenticated`, + skupiny přidané doplňkem
* **anonymous (odhlášený)**: `$all` a `$anonymous`.

## Default htpasswd

Pro zjednodušení instalace, `verdaccio` používá doplněk založený na `htpasswd`. Od verze v3.0.x je používán `verdaccio-htpasswd` jako výchozí doplněk.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximální množství uživatelů, kteří se mohou registrovat, výchozí nastaveno na "+inf".
    # Můžete nastavit -1 pro zablokování registrací.
    #max_users: 1000
```

| Vlastnost | Typ     | Požadované | Příklad    | Podpora | Popis                                               |
| --------- | ------- | ---------- | ---------- | ------- | --------------------------------------------------- |
| file      | řetězec | Ano        | ./htpasswd | všechny | soubor, který obsahuje šifrované přihlašovací údaje |
| max_users | číslo   | Ne         | 1000       | všechny | nastavit limit uživatelů                            |

In case to decide do not allow user to login, you can set `max_users: -1`.