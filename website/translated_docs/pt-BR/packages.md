---
id: pacotes
title: "Permissões dos Pacotes"
---

This is a series of constraints that allow or restrict access to the local storage based on specific criteria.

As restrições de segurança permanecem dependentes do plugin em uso, por padrão o `verdaccio` usa o [htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd). Se você usar um plugin diferente, o comportamento poderá ser diferente. O plugin padrão não suporta `allow_access` e `allow_publish` por si só, ele usa um fallback interno caso o plugin não esteja pronto para isso.

Para mais informações sobre permissões visite a [seção de autenticação no wiki](auth.md).

### Utilização

```yalm
packages:
  # scoped packages
  '@scope/*':
    access: $all
    publish: $all
    proxy: server2

  'private-*':
    access: $all
    publish: $all
    proxy: uplink1

  '**':
    # permite a todos os usuários (incluindo os não autentificados) a ler e
    # publicar todos os pacotes
    access: $all
    publish: $all
```

se nenhum for especificado, o padrão permanece

```yaml
packages:
  '**':
    access: $all
    publish: $authenticated
```

A lista de grupos internos gerenciados pelo `verdaccio` são:

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

Todos os usuários recebem todos esses grupos de permissões, independentemente de serem anônimos ou não, mais os grupos fornecidos pelo plugin, no caso de `htpasswd` retornar o nome de usuário como um grupo. Por exemplo, se você estiver logado como `npmUser`, a lista de grupos será.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Se você quiser proteger um grupo de pacotes específicos dentro do seu grupo, você deve fazer algo semelhante a isso. Vamos usar um `Regex` que cubra todos os pacotes `npmuser-` prefixados. Recomendamos usar um prefixo para seus pacotes, assim será mais fácil protegê-los.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Reinicie o `verdaccio` e no seu console tente instalar o `npmuser-core`.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

Você pode alterar o atual comportamento usando uma autenticação de plugin diferente. O `verdaccio` apenas verifica se o usuário que tentou acessar ou publicar um pacote específico pertence ao grupo correto.

Please note that if you set the `access` permission of a package to something that requires Verdaccio to check your identity, for example `$authenticated`, npm does not send your access key by default when fetching packages. This means all requests for downloading packages will be rejected as they are made anonymously even if you have logged in. To make npm include you access key with all requests, you should set the [always-auth](https://docs.npmjs.com/cli/v7/using-npm/config#always-auth) npm setting to true on any client machines. This can be accomplished by running:

```bash
$ npm config set always-auth=true
```

#### Definir vários grupos

Defining multiple access groups is fairly easy, just define them with a white space between them.

```yaml
  'company-*':
    access: admin internal
    publish: admin
    proxy: server1
  'supersecret-*':
    access: secret super-secret-area ultra-secret-area
    publish: secret ultra-secret-area
    proxy: server1
```

#### Bloqueando o acesso ao conjunto de pacotes

If you want to block the access/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Bloqueando a transmissão de um conjunto de pacotes específicos

You might want to block one or several packages from fetching from remote repositories., but, at the same time, allow others to access different *uplinks*.

Let's see the following example:

```yaml
packages:
  'jquery':
    access: $all
    publish: $all
  'my-company-*':
    access: $all
    publish: $authenticated
  '@my-local-scope/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

Let's describe what we want with the above example:

* Eu quero hospedar minha própria dependência `jquery`, mas eu preciso evitar o proxy.
* Eu quero todas as dependências que combinam com `my-company-*`, mas eu preciso que os pacotes não se realizem via proxy.
* Eu quero todas as dependências que estão no escopo `my-local-scope`, mas eu preciso que os pacotes não se realizem via proxy.
* Eu quero que o resto das dependências se realizem via proxy.

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

#### Use multiple uplinks

You may assign multiple uplinks for use as a proxy to use in the case of failover, or where there may be other private registries in use.

```yaml
'**':
  access: $all
  publish: $authenticated
  proxy: npmjs uplink2
```

#### Cancelando a Publicação de Pacotes

The property `publish` handle permissions for `npm publish` and `npm unpublish`.  But, if you want to be more specific, you can use the property `unpublish` in your package access section, for instance:

```yalm
packages:
  'jquery':
    access: $all
    publish: $all
    unpublish: root
  'my-company-*':
    access: $all
    publish: $authenticated
    unpublish:
  '@my-local-scope/*':
    access: $all
    publish: $authenticated
    # unpublish: property commented out
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

In the previous example, the behaviour would be described:

* todos os usuários podem publicar o pacote `jquery`, mas somente o usuário `root` poderá cancelar a publicação de qualquer versão.
* somente usuários autenticados podem publicar pacotes `my-company-*`, mas **ninguém poderá cancelar a publicação deles**.
* Se `unpublish` estiver comentado, o acesso será concedido ou negado pela definição `publish`.


### Configuração

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Propriedade | Tipo   | Obrigatório | Exemplo        | Suporte        | Descrição                                                                         |
| ----------- | ------ | ----------- | -------------- | -------------- | --------------------------------------------------------------------------------- |
| access      | string | Não         | $all           | completo       | define os grupos com permissão para acessar os pacotes                            |
| publish     | string | Não         | $authenticated | completo       | define os grupos permitidos a publicar                                            |
| proxy       | string | Não         | npmjs          | completo       | limita a busca a um uplink específico                                             |
| storage     | string | Não         | string         | `/some-folder` | ele cria uma subpasta dentro da pasta de armazenamento para cada acesso ao pacote |

> Salientamos a recomendação de não usar mais **allow_access**/**allow_publish** e **proxy_access**, eles estão obsoletos e serão removidos em breve. Use a versão curta de cada um deles (**access**/**publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).
