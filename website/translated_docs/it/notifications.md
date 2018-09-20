---
id: notifiche
title: "Notifiche"
---
Notify fu creato principalmente per essere utilizzato con i webhook entranti di Slack, ma inoltre consegnerà un semplice carico utile ad ogni endpoint. Al momento è solo attivo per il comando `npm publish`.

## Utilizzo

Un esempio con un hook **HipChat**, **Stride** e **Google Hangouts Chat**:

> Verdaccio supporta ogni API, sentiti libero di aggiungere ulteriori esempi.

#### Notificazione singola

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

#### Notificazione multipla

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

## Template

Usiamo [Handlebars](https://handlebarsjs.com/) come template engine principale.

### Esempi di formato

    # iterate all versions
    {{ name }}{{#each versions}} v{{version}}{{/each}}`"}
    
    # publisher and `dist-tag` package published
    {{ publisher.name }} has published {{publishedPackage}}"}
    

### Proprietà

Elenco delle proprietà accessibili tramite template

* Metadata
* Publisher (chi sta pubblicando)
* Pacchetto pubblicato (package@1.0.0)

### Metadata

Pacchetto metadata al quale il template ha accesso

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
    

### Publisher

Si può accedere alle informazioni del pacchetto publisher nel `content` di un webhook utilizzando l'oggetto `publisher`.

Vedi sotto il tipo di oggetto `publisher`:

    {
      name: string,
      groups: string[],
      real_groups: string[]
    }
    

Un esempio:

    notify:
      method: POST
      headers: [{'Content-Type': 'application/json'}]
      endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
      content: '{"color":"green","message":"New package published: * {{ name }}*. Publisher name: * {{ publisher.name }} *.","notify":true,"message_format":"text"}'
    

**Nota:** non è possibile ottenere le informazioni del publisher se il file `package.json` ha già la proprietà `publisher`.

### Pacchetto pubblicato

Si può accedere al pacchetto che è stato pubblicato con la keyword `{{publishedPackage}}` come segue.

    {{ publisher.name }} has published {{publishedPackage}}"}
    

## Configurazione

| Proprietà           | Tipo          | Richiesto | Supporto | Impostazione predefinita | Descrizione                                                                                  |
| ------------------- | ------------- | --------- | -------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| method              | stringa       | No        | tutti    |                          | metodi HTTP                                                                                  |
| packagePattern      | stringa       | No        | tutti    |                          | Eseguire questa notifica solo se il nome del pacchetto coincide con l'espressione regolare   |
| packagePatternFlags | stringa       | No        | tutti    |                          | Qualsiasi flag da utilizzare con l'espressione regolare                                      |
| headers             | array/oggetto | Sì        | tutti    |                          | If this endpoint requires specific headers, set them here as an array of key: value objects. |
| endpoint            | string        | Yes       | all      |                          | set the URL endpoint for this call                                                           |
| content             | string        | Yes       | all      |                          | any [Handlebar](https://handlebarsjs.com/) expressions                                       |