---
id: uplinks
title: "Uplinks"
---
Un *uplink* est un lien avec un registre externe qui donne accès à des paquets externes.

![Uplinks](/img/uplinks.png)

### Utilisation

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

### Configuration

Vous pouvez définir de mutiple uplinks et chacun d’eux doit avoir un nom unique (clé). Ils peuvent avoir deux propriétés:

| Propriété    | Type                 | Obligatoire | Exemple                                 | Soutien | Description                                                                                                                | Par défaut     |
| ------------ | -------------------- | ----------- | --------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- | -------------- |
| url          | chaîne de caractères | Oui         | https://registry.npmjs.org/             | tous    | L’url du registre                                                                                                          | npmjs          |
| ca           | chaîne de caractères | Non         | ~./ssl/client.crt'                      | tous    | Certificat de chemin SSL                                                                                                   | Pas par défaut |
| timeout      | chaîne de caractères | Non         | 100ms                                   | tous    | définir le nouveau délai d’attente pour la demande                                                                         | 30s            |
| maxage       | chaîne de caractères | Non         | 10m                                     | tous    | limite maximale d'échecs à chaque demande                                                                                  | 2m             |
| fail_timeout | chaîne de caractères | No          | 10m                                     | tous    | définit le temps maximal pour qu'une demande devienne un échec                                                             | 5m             |
| max_fails    | numéro               | No          | 2                                       | tous    | limite maximale d'échecs à chaque demande                                                                                  | 2              |
| cache        | booléenne            | No          | [vrai,faux]                             | >= 2.1  | mettre en cache toutes les archives éloignée dans l'archive                                                                | true           |
| auth         | list                 | No          | [see below](uplinks.md#auth-property)   | >= 2.5  | assigns the header 'Authorization' [more info](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules) | disabled       |
| headers      | list                 | No          | authorization: "Bearer SecretJWToken==" | all     | list of custom headers for the uplink                                                                                      | disabled       |
| strict_ssl   | boolean              | No          | [true,false]                            | >= 3.0  | If true, requires SSL certificates be valid.                                                                               | true           |

#### Auth property

The `auth` property allows you to use an auth token with an uplink. Using the default environment variable:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`   
```

or via a specified environment variable:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN`internally will use `process.env['FOO_TOKEN']`

ou en spécifiant directement un jeton:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> Remarque: `jeton` a la priorité sur `jeton_env`

### Vous devez savoir

* Verdaccio n'utilise plus l'authentification de base à partir de la version `v2.3.0`. Tous les jetons générés par verdaccio sont basés sur JWT ([jeton Web JSON](https://jwt.io/))
* Les uplinks doivent être des registres compatibles avec les noeuds finaux `npm`. Par exemple: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* et autre.
* En affectant false au paramètre `cache`, vous économiserez de l'espace sur le disque dur. Cela évitera de stocker les `tarballs`, mais [conservera les métadonnées dans les dossiers](https://github.com/verdaccio/verdaccio/issues/391).
* Le dépassement avec plusieurs uplinks peut ralentir la recherche de vos paquets car pour chaque demande transmise par un client npm, Verdaccio transmet à son tour un appel pour chaque uplink.
* Le format (timeout, maxage et fail_timeout) suit les [unités de mesure NGINX](http://nginx.org/en/docs/syntax.html)