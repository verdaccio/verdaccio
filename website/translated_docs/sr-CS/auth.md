---
id: autentifikacija
title: "Autentifikacija"
---
Autentifikacija je vezana za auth [plugin](plugins.md) koji koristite. Ograničenja paketa su definisana preko [Package Access](packages.md).

Autentifikaciju klijenta vrši sam `npm` klijent. Nakon prijave na aplikaciju:

```bash
npm adduser --registry http://localhost:4873
```

Token se generiše u fajlu za konfiguraciju `npm`, koji se nalazi u home folder-u korisnika. Kako biste saznali više o `.npmrc` pročitajte [zvaničnu dokumentaciju](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Anonimno publikovanje

`verdaccio` Vam omogućava da pružite mogućnost anonimnog publikovanja. Kako biste uspeli u tome, potrebno je da podesite [packages access](packages.md).

Primer:

```yaml
  'my-company-*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
```

Kao što je opisano, [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) sve dok `npm@5.3.0` i sve verzije ne budu usaglašene **neće Vam biti omogućeno da publikujete bez tokena**. Ipak, `yarn` nema ta ograničenja.

## Podrazumevana htpasswd

Kako bi se pojednostavio setup, `verdaccio` koristi plugin baziran na `htpasswd`. Od verzije v3.0.x [eksterni plugin](https://github.com/verdaccio/verdaccio-htpasswd) se koristi kao podrazumevan. Verzija v2.x i dalje sadrži ugrađenu verziju ovog plugin-a.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maksimalni broj korisnika koji se može registovati, podrazumevano je beskonačno, "+inf".
    # Ovo možete podesiti na -1 kako biste onemogućili registrovanje.
    #max_users: 1000
```

| Svojstvo  | Tip    | Neophodno | Primer     | Podrška | Opis                                   |
| --------- | ------ | --------- | ---------- | ------- | -------------------------------------- |
| file      | string | Da        | ./htpasswd | all     | file koji sadrži šivrovane credentials |
| max_users | number | Ne        | 1000       | all     | podešava maksimalni broj korisnika     |

Ako se odlučite na to da ne dozvolite korisnicima da se prijave, možete podesiti `max_users: -1`.