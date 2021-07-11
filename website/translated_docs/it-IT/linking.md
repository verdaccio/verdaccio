---
id: linking-remote-registry
title: "Collegare un Registro Remoto"
---

Verdaccio è un proxy e di default [collega](uplinks.md) il registro pubblico.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

È possibile collegare registri multipli: il documento seguente guiderà attraverso alcune utili configurazioni.

## Utilizzo dello Scope di Associazione

L'unica maniera per accedere a registri multipli utilizzando il `.npmrc` è la funzione scope come segue:

```
// .npmrc
registry=https://registry.npmjs.org
@mycompany:registry=http://localhost:4873
```

Questo approccio è valido, tuttavia presenta diversi svantaggi:

* It **only works with scopes**
* Lo scope deve coincidere, **non sono permesse Espressioni Regolari**
* Uno scope **non può raccogliere da registri multipli**
* Token e password **devono essere definiti all'interno di** `.npmrc` e registrati nel repository.

Vedi un esempio completo [qui](https://stackoverflow.com/questions/54543979/npmrc-multiple-registries-for-the-same-scope/54550940#54550940).

## Collegare un Registro

Collegare un registro è abbastanza semplice. Per primo, definire una sezione nuova nella sezione `uplinks`. Notare, l'ordine qui è irrilevante.

```yaml
  uplinks:
    private:
      url: https://private.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: private

```

Aggiungere una sezione `proxy` per definire il registro selezionato che si desidera utilizzare come proxy.

## Collegare Registri Multipli

```yaml
  uplinks:
    server1:
      url: https://server1.registry.net/npm
    server2:
      url: https://server2.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: server1 server2
```

Verdaccio supporta registri multipli nel campo `proxy`. La richiesta sarà risolta con il primo della lista; se fallisce, proverà con il successivo della lista e così via.

## Registro Offline

È del tutto possibile avere un intero Registro Offline. Se non si desidera alcuna connettività con remoti esterni, è possibile eseguire ciò che segue.

```yaml

auth:
  htpasswd:
    file: ./htpasswd
uplinks:
packages:
  '@my-company/*':
    access: $all
    publish: none
  '@*/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
```

Eliminare tutti i campi `proxy` all'interno di ogni sezione di `packages`. Il registro diventerà completamente offline.
