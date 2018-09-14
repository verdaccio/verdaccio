---
id: uplink
title: "Uplink"
---
Un *uplink* è un link ad un registro esterno che fornisce accesso ai pacchetti esterni.

![Uplinks](/img/uplinks.png)

### Utilizzo

```yaml
uplinks:
  npmjs:
   url: https://registry.npmjs.org/
  server2:
    url: http://mirror.local.net/
    timeout: 100ms
  server3:
    url: http://mirror2.local.net:9000/
  baduplink:
    url: http://localhost:55666/
```

### Configurazione

È possibile definire uplink multipli ed ognuno di essi deve avere un nome univoco (key). Possono avere due proprietà:

| Proprietà    | Tipo               | Richiesto | Esempio                                  | Supporto | Descrizione                                                                                                                                     | Impostazione predefinita |
| ------------ | ------------------ | --------- | ---------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| url          | stringa            | Sì        | https://registry.npmjs.org/              | tutti    | L'url del registro di sistema                                                                                                                   | npmjs                    |
| ca           | stringa            | No        | ~./ssl/client.crt'                       | tutti    | Certificato del percorso SSL                                                                                                                    | Non predefinito          |
| timeout      | stringa            | No        | 100ms                                    | tutti    | impostare nuovo timeout per la richiesta                                                                                                        | 30s                      |
| maxage       | stringa            | No        | 10m                                      | tutti    | limite massimo di fallimenti ad ogni richiesta                                                                                                  | 2m                       |
| fail_timeout | stringa            | No        | 10m                                      | tutti    | definire il tempo massimo dopo il quale una richiesta fallisce                                                                                  | 5m                       |
| max_fails    | numero             | No        | 2                                        | tutti    | limite massimo di fallimenti ad ogni richiesta                                                                                                  | 2                        |
| cache        | variabile booleana | No        | [vero/falso]                             | >= 2.1   | memorizzare nella cache tutti i tarball remoti in archivio                                                                                      | vero                     |
| auth         | elenco             | No        | [vedi sotto](uplinks.md#auth-property)   | >= 2.5   | assegnare l'intestazione 'Autorizzazione' [ ulteriori informazioni](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules) | disabilitato             |
| headers      | elenco             | No        | autorizzazione: "Bearer SecretJWToken==" | tutti    | elenco di intestazioni personalizzate per l'uplink                                                                                              | disabilitato             |
| strict_ssl   | variabile booleana | No        | [vero/falso]                             | >= 3.0   | Se vero, richiede che i certificati SSL siano validi.                                                                                           | vero                     |

#### Proprietà dell' auth

La proprietà `auth` consente di usare un auth token con un uplink. Utilizzare la variabile ambientale predefinita:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`   
```

o tramite una specifica variabile ambientale:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN` utilizzerà internamente `process.env['FOO_TOKEN']`

o specificando direttamente un token:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> Nota: `token` ha la priorità su `token_env`

### Da sapere

* Verdaccio non utilizza Basic Authentication dalla versione `v2.3.0`. Tutti i token generati da verdaccio sono basati su JWT ([JSON Web Token](https://jwt.io/))
* Gli uplink devono essere registri compatibili con gli endpoint `npm`. Per esempio: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* ed altri ancora.
* Impostare la `cache` su falso aiuterà a risparmiare spazio nel disco rigido. Ciò eviterà di memorizzare i `tarballs` ma [ terrà i metadata nelle cartelle](https://github.com/verdaccio/verdaccio/issues/391).
* Exceed with multiple uplinks might slow down the lookup of your packages due for each request a npm client does, verdaccio does 1 call for each uplink.
* The (timeout, maxage and fail_timeout) format follow the [NGINX measurement units](http://nginx.org/en/docs/syntax.html)