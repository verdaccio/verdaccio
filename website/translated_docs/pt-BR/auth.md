---
id: autenticacao
title: "Autenticação"
---
A autenticação está ligada ao [plugin](plugins.md) auth que você está utilizando. As restrições do pacote também são tratadas pelo [Package Access](packages.md).

The client authentification is handled by `npm` client itself. Once you login to the application:

```bash
npm adduser --registry http://localhost:4873
```

A token is generated in the `npm` configuration file hosted in your user home folder. For more information about `.npmrc` read the [official documentation](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Anonymous publish

`verdaccio`allows you to enable anonymous publish, to achieve that you will need to set up correctly your [packages access](packages.md).

Eg:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**. However `yarn` has not such limitation.

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

| Property  | Type   | Obrigatório | Exemplo    | Support | Descrição                                                    |
| --------- | ------ | ----------- | ---------- | ------- | ------------------------------------------------------------ |
| file      | string | Sim         | ./htpasswd | all     | arquivo onde ficam armazenadas as credenciais criptografadas |
| max_users | number | Não         | 1000       | todos   | define o limite de usuários                                  |

No caso de não permitir o login de usuário, você pode definir `max_users: -1`.