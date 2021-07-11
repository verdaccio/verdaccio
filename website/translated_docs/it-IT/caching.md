---
id: caching
title: "Strategie di caching"
---

Verdaccio di default memorizza nella cache tutti i pacchetti nella cartella `/storage`. Tuttavia si può decidere di voler seguire una strategia differente. Utilizzando i plugin si potrebbe usare il cloud o qualsiasi tipo di database.

## Scenari di caching

* Costruire un progetto Node.js su server di **Continous Integration** (Bamboo, GitLab, Jenkins, ecc.) è un'attività che può essere eseguita diverse volte al giorno, perciò il server effettuerà il download dal registro di un gran numero di tarball ogni volta che questo avviene.  Come al solito, i tool di CI puliscono la cache dopo ogni build e il processo ricomincia nuovamente ogni volta. Ciò è uno spreco di banda e riduce il traffico esterno. **È possibile utilizzare Verdaccio per memorizzare nella cache tarball e metadati nella nostra rete interna e per dare un impulso in fase di build.**
* **Latenza e Connettività**, non tutti i Paesi godono di una connessione ad alta velocità. Per questo motivo memorizzare i pacchetti nella cache localmente nella propria rete è decisamente comodo. Se si sta viaggiando o si ha una connessione debole, roaming o in paesi con Firewall resistenti che potrebbero incidere sull'esperienza dell'utente (es: corruzione di tarball).
* **Modalità Offline**, tutti i Node Package Manager oggigiorno utilizzano la loro cache interna, ma è comune che progetti differenti possano usare tool differenti, che comprendono file di lock e così via. Quei tool non sono in grado di condividere la cache, l'unica soluzione è centralizzata e si basa su un registro proxy, Verdaccio memorizza nella cache tutti i metadati e i tarball vengono scaricati su richiesta riuscendo a condividerli in tutto il progetto.
* Evitare che qualsiasi registro remoto restituisca improvvisamente l'errore *HTTP 404* per i tarball che erano disponibili in precedenza (conosciuto anche come [left-pad issue](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)).


# Strategie per build più veloci

> Siamo alla ricerca di ulteriori strategie, condividi la tua esperienza in questo campo

## Evitare il Caching di tarball

Se si ha a disposizione uno spazio di archiviazione limitato, si dovrebbe evitare di memorizzare nella cache tarball; abilitando false su `cache` in ciascun uplink si memorizzeranno nella cache esclusivamente file di metadati.

```
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    cache: false
```

## Estensione della Data di Scadenza della Cache

 Verdaccio di default attende 2 minuti per invalidare i metadati della cache prima di recuperare nuove informazioni dal registro remoto.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    maxage: 30m
```

Incrementando il valore di `maxage` in ciascun `uplink`, i remoti verranno interrogati con minore frequenza. Questa potrebbe essere una strategia valida in caso non si aggiornino le dipendenze così spesso.


## Utilizzare la memoria invece dell'hardrive

A volte non è un passaggio fondamentale memorizzare nella cache pacchetti, quanto memorizzare pacchetti di route da registri differenti e accelerare le fasi di build. Sono disponibili due plugin per evitare del tutto di scrivere su un hard drive fisico utilizzando la memoria.

```bash
  npm install -g verdaccio-auth-memory
  npm install -g verdaccio-memory
```

La configurazione appare come questa

```yaml
auth:
  auth-memory:
    users:
      foo:
        name: test
        password: test
store:
  memory:
    limit: 1000
```

Ricorda, una volta che il server viene riavviato i dati vengono persi, raccomandiamo questa configurazione in casi in cui non sia necessario che continui a funzionare.
