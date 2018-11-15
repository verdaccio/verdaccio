---
id: server-configuration
title: "Server Configuration"
---
Ovo je najbazičnija konfiguracija za linux server ali nam se čini važnim da dokumentujemo i podelimo sa Vama sve korake kako bi verdaccio stalno radio na serveru. Biće Vam potrebne root (ili sudo) dozvole za navedeno.

## Pokretanje, kao zaseban korisnik

Najpre kreirajte verdaccio korisnika:

```bash
$ sudo adduser --disabled-login --gecos 'Verdaccio NPM mirror' verdaccio
```

Zatim kreirate shell kao verdaccio korisnik, putem sledeće komande:

```bash
$ sudo su verdaccio
$ cd ~
```

Komanda 'cd ~' šalje Vas do home direktorijuma verdaccio korisnika. Postarajte se da pokrenete verdaccio barem jednom kako biste generisali config fajl. Modifikujte ga prema svojim potrebama.

## Listening na svim adresama

Ako želite da osluškujete (listen to) svaku eksternu adresu, podesite listen direktivu na:

```yaml
# you can specify listen address (or simply a port)
listen: 0.0.0.0:4873
```

Ako imate pokrenut `verdaccio` u Amazon EC2 instanci, [moraćete da podesite listen u change your config file](https://github.com/verdaccio/verdaccio/issues/314#issuecomment-327852203) kao što je prikazano u navedenom primeru.

> Konfigurisanje Apache-a? Molimo Vas da pogledate [Reverse Proxy Setup](reverse-proxy.md)

## Kako da verdaccio radi neprekidno

Možemo koristiti node paket zvani 'forever' kako biste podesili verdaccio da radi neprekidno. https://github.com/nodejitsu/forever

Prvo instalirajte forever globalno:

```bash
$ sudo npm install -g forever
```

Proverite da li ste pokrenuli verdaccio barem jednom kako biste generisali config fajl i upisali admin korisnika. Posle toga, možete koristiti sledeću komandu kako biste pokrenuli verdaccio:

```bash
$ forever start `which verdaccio`
```

Možete pogledati dokumentaciju za više informacija o tome kako da koristite forever.

## Preživljavanje resetovanja servera

Možemo istovremeno koristiti crontab i forever kako bismo restartovali verdaccio nakon svakog reboot-ovanja servera. Nakon što ste prijavljeni kao verdaccio korisnik, zadajte sledeće:

```bash
$ crontab -e
```

Moguće je da ćete dobiti pitanje da odaberete editor. Odaberite svoj omiljeni i nastavite. Unesite sledeći input u fajl:

    @reboot /usr/bin/forever start /usr/lib/node_modules/verdaccio/bin/verdaccio
    

Lokacije mogu varirati u zavisnosti od podešavanja servera. Ako želite da saznate gde se nalaze Vaši fajlovi, možete koristiti comandu 'which':

```bash
$ which forever
$ which verdaccio
```