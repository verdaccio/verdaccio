---
id: notifications
title: "Notificações"
---

Notify was built primarily to use with Slack's Incoming webhooks, but will also deliver a simple payload to any endpoint. This is currently only active for the `npm publish` command.

## Utilização

Um exemplo com um hook de **HipChat**, **Stride** e **Google Hangouts Chat**:

> Verdaccio suporta qualquer API, fique à vontade para adicionar mais exemplos.

#### Notificação única

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

#### Notificação múltipla

```yaml
notify:
  'example-google-chat':
    method: POST
    headers: [{'Content-Type': 'application/json'}]
    endpoint: https://chat.googleapis.com/v1/spaces/AAAAB_TcJYs/messages?key=myKey&token=myToken
    content: '{"text":"New package published: `{{ name }}{{#each versions}} v{{version}}{{/each}}`"}'
  'example-hipchat':
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
  'example-stride':
     method: POST
     headers: [{'Content-Type': 'application/json'}, {'authorization': 'Bearer secretToken'}]
     endpoint: https://api.atlassian.com/site/{cloudId}/conversation/{conversationId}/message
     content: '{"body": {"version": 1,"type": "doc","content": [{"type": "paragraph","content": [{"type": "text","text": "New package published: * {{ name }}* Publisher name: * {{ publisher.name }}"}]}]}}'
```

## Modelo

Nós usamos [Handlebars](https://handlebarsjs.com/) como mecanismo de modelo principal.

### Exemplos de Formato

```
# iterar todas as versões
{{ name }}{{#each versions}} v{{version}}{{/each}}

# editor e pacote `dist-tag` publicado
{{ publisher.name }} has published {{ publishedPackage }}
```

### Propriedades

Lista de propriedades acessáveis via modelo

* Metadata
* Publisher (quem está publicando)
* Package Published (package@1.0.0)

### Metadata

Pacote de metadata que o modelo tem acesso

```
{
    "_id": "@test/pkg1",
    "name": "@test/pkg1",
    "description": "",
    "dist-tags": {
        "beta": "1.0.54"
    },
    "versions": {
        "1.0.54": {
            "name": "@test/pkg1",
            "version": "1.0.54",
            "description": "some description",
            "main": "index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "keywords": [],
            "author": {
                "name": "Author Name",
                "email": "author@domain.com"
            },
            "license": "MIT",
            "dependencies": {
                "webpack": "4.12.0"
            },
            "readmeFilename": "README.md",
            "_id": "@ test/pkg1@1.0.54",
            "_npmVersion": "6.1.0",
            "_nodeVersion": "9.9.0",
            "_npmUser": {},
            "dist": {
                "integrity": "sha512-JlXWpLtMUBAqvVZBvH7UVLhXkGE1ctmXbDjbH/l0zMuG7wVzQ7GshTYvD/b5C+G2vOL2oiIS1RtayA/kKkTwKw==",
                "shasum": "29c55c52c1e76e966e706165e5b9f22e32aa9f22",
                "tarball": "http://localhost:4873/@test/pkg1/-/@test/pkg1-1.0.54.tgz"
            }
        }
    },
    "readme": "# test",
    "_attachments": {
        "@test/pkg1-1.0.54.tgz": {
            "content_type": "application/octet-stream",
            "data": "H4sIAAAAAAAAE+y9Z5PjyJIgOJ ...",
            "length": 33112
        }
    },
    "time": {}
}
```


### Editor

You can get access to the package publisher information in the `content` of a webhook using the `publisher` object.

Veja abaixo o tipo de objeto `publisher`:

```
{
  name: string,
  groups: string[],
  real_groups: string[]
}
```

Um exemplo:

```
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*. Publisher name: * {{ publisher.name }} *.","notify":true,"message_format":"text"}'
```

**Nota:** Não é possível obter as informações do editor se o arquivo `package.json` já possui a propriedade `publisher`.

### Pacote Publicado

Você pode acessar o pacote que está sendo publicado com a palavra-chave `{{publishedPackage}}` do seguinte modo.

```
{{ publisher.name }} has published {{ publishedPackage }}
```

## Configuração

| Propriedade         | Tipo         | Obrigatório | Suporte  | Padrão | Descrição                                                                                                        |
| ------------------- | ------------ | ----------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| method              | string       | Não         | completo |        | HTTP verb                                                                                                        |
| packagePattern      | string       | Não         | completo |        | Só execute esta notificação se o nome do pacote corresponder à expressão regular                                 |
| packagePatternFlags | string       | Não         | completo |        | Qualquer sinalizador a ser usado com a expressão regular                                                         |
| headers             | array/object | Sim         | completo |        | Se esse terminal exigir headers específicos, configure-os aqui como uma matriz de objetos da key: value objects. |
| endpoint            | string       | Sim         | completo |        | define o endpoint da URL para esta chamada                                                                       |
| content             | string       | Sim         | completo |        | qualquer expressão [Handlebar](https://handlebarsjs.com/)                                                        |
