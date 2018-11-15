---
id: uplinks
title: "Uplinks"
---
*uplink* je link koji sadrži external registry koji omogućava pristup do external packages.

![Uplinks](/img/uplinks.png)

### Kako se koristi

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

### Konfigurisanje

Možete definisati više uplinks-a, a svaki od njih mora imati jedinstveno ime (key). uplinks mogu imati dva svojstva:

| Svojstvo            | Tip     | Potrebno | Primer                                 | Podrška | Opis                                                                                                                               | Podrazumevano     |
| ------------------- | ------- | -------- | -------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| url                 | string  | Da       | https://registry.npmjs.org/            | potpuna | Url registry-a                                                                                                                     | npmjs             |
| ca                  | string  | Ne       | ~./ssl/client.crt'                     | potpuna | Put do SSL sertifikata                                                                                                             | Nema ništa zadato |
| timeout             | string  | Ne       | 100ms                                  | potpuna | podesite novi timeout za request                                                                                                   | 30s               |
| maxage              | string  | Ne       | 10m                                    | potpuna | limitira maksimalni broj neuspelih zahteva                                                                                         | 2m                |
| fail_timeout        | string  | Ne       | 10m                                    | potpuna | definiše maksimalno vreme nakon kojeg zahtev postaje neuspešan                                                                     | 5m                |
| max_fails           | number  | No       | 2                                      | potpuna | limitira maksimalni broj neuspelih zahteva                                                                                         | 2                 |
| cache               | boolean | Ne       | [true,false]                           | >= 2.1  | keširanje svih tarballs iz storage-a                                                                                               | true              |
| auth                | list    | Ne       | [vidi ispod](uplinks.md#auth-property) | >= 2.5  | dodeljuje zaglavlje 'Authorization' [više informacija](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules) | onemogućeno       |
| zaglavlja (headers) | list    | Ne       | autorizacija: "Bearer SecretJWToken==" | potpuna | lista korisničkih, prilagođenih zaglavlja za uplink                                                                                | onemogućeno       |
| strict_ssl          | boolean | Ne       | [true,false]                           | > = 3.0 | If true, zahteva da SSL certifikat bude validan.                                                                                   | true              |

#### Auth property

Svojstvo `auth` Vam omogućava da koristite auth token sa uplink. Koristite podrazumevanu environment variablu:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`   
```

ili preko definisane environment variable:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN`za internu upotrebu koristi `process.env['FOO_TOKEN']`

ili je direktno definisano tokenom:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> Napomena: `token` ima prioritet nad `token_env`

### Valjalo bi znati

* Verdaccio ne koristi Basic Authentication od verzije `v2.3.0`. Svi tokeni koje generiše verdaccio, bazirani su na JWT ([JSON Web Token](https://jwt.io/))
* Uplinks moraju biti registries kompatibilni sa `npm` endpoints. Primer: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* i tako dalje.
* Podešavanje `cache` na false, pomoći će da se uštedi prostor na hard disku. Tako se izbegava čuvanje `tarballs-a` ali [će čuvati metadata u folderima](https://github.com/verdaccio/verdaccio/issues/391).
* Preterivanje sa uplinks može usporiti lookup Vaših packages-a jer svaki put kada npm client traži zahtev, verdaccio pravi 1 pozivanje za svaki uplink.
* Format za (timeout, maxage i fail_timeout) je usklađen sa [NGINX jedinicama mere](http://nginx.org/en/docs/syntax.html)