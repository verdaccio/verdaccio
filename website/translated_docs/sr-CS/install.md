---
id: instalacija
title: "Instalacija"
---
Verdaccio je multi-platformna web aplikacija. Da biste je instalirali, potrebno je da ispunite nekoliko preduslova.

#### Preduslovi

1. Node viši od 
    - Za verziju `verdaccio@2.x` Node `v4.6.1` je najstarija podržana verzija.
    - Za verziju `verdaccio@latest` Node `6.12.0` je najstarija podržana verzija.
2. npm `>=3.x` ili `yarn`
3. Web interfejs podržava `Chrome, Firefox, Edge, i IE9` pretraživače.

## Instalacija CLI

`verdaccio` mora biti instaliran globalno, korišćenjem neke od navedenih metoda:

Koristi `npm`

```bash
npm install -g verdaccio
```

ili koristi `yarn`

```bash
yarn global add verdaccio
```

![install verdaccio](/svg/install_verdaccio.gif)

## Osnovna upotreba

Jednom kada se instalita, sve što treba je da izvršite CLI komandu:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

Za dodatne informacije o CLI molimo Vas [da pročitate cli sekciju](cli.md).

## Docker Image

`verdaccio` poseduje zvanični docker image koji možete koristiti, a u većini slučajeva, podrazumevana konfiguracija radi sasvim dobro. Za više informacija o tome kako da instalirate official image, [pročitajte docker sekciju](docker.md).

## Cloudron

`verdaccio` je takođe dostupan i kao instalacija u samo jednom kliku, na [Cloudron](https://cloudron.io)

[![Instalacija](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.eggertsson.verdaccio)