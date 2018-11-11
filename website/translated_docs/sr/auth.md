---
id: authentification
title: "Authentification"
---
Аутентификација је везана за auth [plugin](plugins.md) који користите. Ограничења пакета су дефинисана преко [Package Access](packages.md).

Аутентификацију клијента врши сам `npm` клијент. Након пријаве на апликацију:

```bash
npm adduser --registry http://localhost:4873
```

Токен се генерише у фајлу за конфигурацију `npm` који се налази у home фолдеру корисника. Како бисте сазнали више о `.npmrc` прочитајте [official documentation](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Анонимно публиковање

`verdaccio` Вам омогућава да пружите могућност анонимног публиковања. Како бисте успели у томе, потребно је да подесите [packages access](packages.md).

Пример:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Као што је описано, [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) све док `npm@5.3.0` и све верзије не буду усаглашене **неће Вам бити омогућено да публикујете без токена**. However `yarn` has not such limitation.

## Default htpasswd

In order to simplify the setup, `verdaccio` use a plugin based on `htpasswd`. As of version v3.0.x an [external plugin](https://github.com/verdaccio/verdaccio-htpasswd) is used by default. The v2.x version of this package still contains the built-in version of this plugin.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    #max_users: 1000
```

| Property  | Type   | Required | Example    | Support | Description                              |
| --------- | ------ | -------- | ---------- | ------- | ---------------------------------------- |
| file      | string | Yes      | ./htpasswd | all     | file that host the encrypted credentials |
| max_users | number | No       | 1000       | all     | set limit of users                       |

In case to decide do not allow user to login, you can set `max_users: -1`.