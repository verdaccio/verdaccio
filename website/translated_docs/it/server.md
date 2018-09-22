---
id: server-configuration
title: "Configurazione del server"
---
Questa è principalmente la documentazione della configurazione di base per il server di linux ma credo sia importante documentare e condividere i passi che ho seguito per avviare permanentemente verdaccio sul mio server. Serviranno le autorizzazioni di root (o sudo) per quello che segue.

## Gestire come utente separato

Come prima cosa creare l'utente verdaccio:

```bash
$ sudo adduser --disabled-login --gecos 'Verdaccio NPM mirror' verdaccio
```

Creare una shell come l'utente verdaccio utilizzando il seguente comando:

```bash
$ sudo su verdaccio
$ cd ~
```

Il comando 'cd ~' manda alla cartella home dell'utente verdaccio. Assicurarsi di eseguire verdaccio almeno una volta per generare il file di configurazione. Modificarlo a seconda delle proprie esigenze.

## Ascolto di tutti gli indirizzi

Se si desidera ascoltare ogni indirizzo esterno impostare la direttiva listen nella configurazione su:

```yaml
# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873
```

Se si sta eseguendo `verdaccio` in un'istanza di Amazon EC2, [ sarà necessario impostare l'ascolto nel cambiare il file di configurazione](https://github.com/verdaccio/verdaccio/issues/314#issuecomment-327852203) come viene descritto sopra.

> Devi configurare Apache? Controlla per favore la [Configurazione Inversa del Proxy](reverse-proxy.md)

## Mantenere verdaccio in funzione

È possibile utilizzare il pacchetto del nodo chiamato 'forever' per mantenere in funzione il sito di verdaccio

Innanzitutto installare forever globalmente:

```bash
$ sudo npm install -g forever
```

Assicurarsi di aver avviato verdaccio almeno una volta per generare il file di configurazione ed annotare l'utente amministratore creato. Successivamente può essere usato il seguente comando per avviare verdaccio:

```bash
$ forever start `which verdaccio`
```

Per ulteriori informazioni su come utilizzare forever verificare la documentazione.

## Durata dei riavvi del server

Si può utilizzare crontab e forever contemporaneamente per riavviare verdaccio in seguito ad una reinizializzazione del server. Quando sei loggato come utente verdaccio, effettua le seguenti operazioni:

```bash
$ crontab -e
```

Questo potrebbe richiedere di scegliere un editor. Selezionare il preferito e procedere. Aggiungere la seguente annotazione al file:

    @reboot /usr/bin/forever start /usr/lib/node_modules/verdaccio/bin/verdaccio
    

Le locazioni potrebbero variare a seconda della configurazione del server. Se si vuole sapere dove si trovano i file, si può usare il comando 'which':

```bash
$ which forever
$ which verdaccio
```