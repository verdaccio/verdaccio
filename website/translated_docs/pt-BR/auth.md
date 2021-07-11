---
id: authentication
title: "Autenticação"
---

The authentication is tied to the auth [plugin](plugins.md) you are using. The package restrictions are also handled by the [Package Access](packages.md).

The client authentication is handled by the `npm` client itself. Once you log in to the application:

```bash
npm adduser --registry http://localhost:4873
```

Um token é gerado no arquivo de configuração `npm` hospedado na pasta inicial do seu usuário. Para mais informações sobre o `.npmrc` leia a [documentação oficial](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Publicação anônima

`verdaccio` allows you to enable anonymous publish. To achieve that you will need to correctly set up your [packages access](packages.md).

Por exemplo:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**.

## Entendendo Grupos

### O significado de `$all` e `$anonymous`

As you know *Verdaccio* uses `htpasswd` by default. Esse plugin não implementa os métodos `allow_access`, `allow_publish` e `allow_unpublish`. Assim, o *Verdaccio* irá lidar com isso da seguinte maneira:

* Se você não está logado (você está anônimo), `$all` e `$anonymous` significam exatamente o mesmo.
* If you are logged in, `$anonymous` won't be part of your groups and `$all` will match any logged user. A new group `$authenticated` will be added to your group list.

Please note: `$all` **will match all users, whether logged in or not**.

**O comportamento anterior só se aplica ao plugin de autenticação padrão**. Se você estiver usando um plugin personalizado e os implementos de plugin `allow_access`, `allow_publish` ou `allow_unpublish`, a resolução do acesso depende do próprio plugin. Verdaccio só irá definir os grupos padrão.

Vamos recapitular:

* **logged in**: `$all` and `$authenticated` + groups added by the plugin.
* **logged out (anonymous)**: `$all` and `$anonymous`.

## Default htpasswd

In order to simplify the setup, `verdaccio` uses a plugin based on `htpasswd`. Since version v3.0.x the `verdaccio-htpasswd` plugin is used by default.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Quantidade máxima de usuários autorizados a se registrar, padrão "+inf".
    # Você pode definir isso como -1 para desativar o registro.
    #max_users: 1000
```

| Propriedade | Tipo   | Obrigatório | Exemplo    | Suporte  | Descrição                                         |
| ----------- | ------ | ----------- | ---------- | -------- | ------------------------------------------------- |
| file        | string | Sim         | ./htpasswd | completo | arquivo que hospeda as credenciais criptografadas |
| max_users   | número | Não         | 1000       | todos    | define o limite de usuários                       |

In case you decide to prevent users from signing up themselves, you can set `max_users: -1`.