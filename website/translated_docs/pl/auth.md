---
id: uwierzytelnianie
title: "Uwierzytelnianie"
---
The authentification is tied to the auth [plugin](plugins.md) you are using. The package restrictions also is handled by the [Package Access](packages.md).

Uwierzytelnianie klienta jest obsługiwane przez samego klienta `npm`. Kiedy już zalogujesz się do aplikacji:

```bash
npm adduser --registry http://localhost:4873
```

Token jest generowany w pliku konfiguracyjnym `npm` znajdującym się w folderze domowym Twojego użytkownika. Aby uzyskać więcej informacji o `.npmrc` przeczytaj [oficjalną dokumentację](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Anonimowa publikacja

`verdaccio`allows you to enable anonymous publish, to achieve that you will need to set up correctly your [packages access](packages.md).

Eg:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**. Jednakże `yarn` nie posiada takich ograniczeń.

## Domyślne htpasswd

Aby ułatwić konfigurację, `verdaccio` używa wtyczki bazującej na `htpasswd`. Począwszy od wersji v3.0.x domyślnie używana jest [zewnętrzna wtyczka](https://github.com/verdaccio/verdaccio-htpasswd). Ten pakiet, w wersji v2.x nadal zawiera wbudowaną wersję tej wtyczki.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Właściwość | Typ         | Wymagane | Przykład   | Wsparcie  | Opis                                              |
| ---------- | ----------- | -------- | ---------- | --------- | ------------------------------------------------- |
| plik       | ciąg znaków | Tak      | ./htpasswd | wszystkie | plik, który udostępnia zaszyfrowane poświadczenia |
| max_users  | numer       | Nie      | 1000       | all       | ustaw limit użytkowników                          |

W przypadku, gdy będziesz chciał wyłączyć możliwość zalogowania się, ustaw `max_users: -1`.