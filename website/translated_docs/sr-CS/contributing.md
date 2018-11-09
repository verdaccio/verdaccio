---
id: doprinošenje
title: "Doprinošenje Verdaccio-u"
---
First of all Plivanje u vodama nepoznatog koda nije lako, ali, mi smo tu da Vam pomognemo.

## Kanali za komunikaciju

Ako ste voljni da pitate, na raspolaganju su dva kanala za diskusiju:

* [Javni Discord kanal](http://chat.verdaccio.org/)

## Hajde da počnemo

Na prvi pogled, verdaccio je jedinstveni repozitorijum, ali u praksi postoje mnogi načini da doprinesete razvoju i upotrebite tehnologiju.

### Nađite svoje mesto pod suncem

Svi mi posedujemo različite veštine, hajde da otkrijemo gde je kome udobno.

### Znam ili želim da naučim Node.js

Node.js je osnova `verdaccio`. Koristimo biblioteke kao na primer `express`, `commander`, `request` ili `async`. Verdaccio je praktično Rest API koji uspostavlja komunikaciju sa `npm` klijent-kompatibilnim, kao što je `yarn`.

Imamo dugačku [listu plugina](plugins.md) spremnu da se koristi i istovremeno unapređuje, a ko zna, [možda se odlučite da napravite i svoj Plugin](dev-plugins.md).

### Voleo bih kada bih mogao da radim u User Interface-u

Nedavno smo se prebacili na korišćenje modernih tehnologija kao što su `React` i `element-react`. Uzbuđeni smo zbog novih ideja i razmišljanja kako da unapredimo UI.

### Više mi prija da unapređujem Stack

Naravno da možete i bili bismo jako srećni ako biste učestvovali u unapređivanju stack-a. Mogli biste na primer da poboljšate dependencies kao na primer `eslint`, `stylelint`, `webpack`. Čak i ako biste mogli samo malo da poboljšate `webpack` konfiguraciju, to bi bilo sjajno. Svaka sugestija je dobrodošla. Osim toga, ako imate iskustva sa **Yeoman-om** mogli biste da nam pomognete sa [verdaccio generatorom](https://github.com/verdaccio/generator-verdaccio-plugin).

Evo nekih od ideja:

* Kreirajte common eslint rules koja će se koristiti u svim dependencies ili pluginima
* Unapredite Flow types definitions delivery
* Kako preći na Webpack 4
* Unapredite hot reload sa Webpack-om
* Pošto koristimo babel i webpack u svim dependencies, zašto ne bismo imali zajednički preset?
* Unapredite continous integration delivery

### Sjajan sam u sređivanju Dokumentacije

Mnogi saradnici imaju dar za pronalaženje grešaka u kucanju i gramatičkih grešaka, a to je jako važno jer podiže iskustvo korišćenja na novi nivo.

### Ja sam Dizajner

Frontend našeg website <http://www.verdaccio.org/> bi bio jako srećan da vidi u usvoji neku od Vaših ideja.

Inače, naš sajt je baziran na [Docusaurus](https://docusaurus.io/).

### Ja sam DevOps

Imamo veoma popularan Docker image <https://hub.docker.com/r/verdaccio/verdaccio/> kome je potrebno održavanje i prilično velika unapređenja. Trebamo Vaše znanje, stavljeno u službu svih korisnika.

Imamo podršku za **Kubernetes**, **Puppet**, **Ansible** i **Chef**. Potrebna nam je pomoć za sve to, tako da, slobodno bacite pogled na sve navedene repozitorijume.

### Mogao bih da radim Prevođenje

Verdaccio stremi ka tome da bude dostupan na što više jezika. Kako bismo to postigli, **imamo apsolutno sjajnu podršku** preko [Crowdin-a](https://crowdin.com), neverovatno dobre platforme za prevođenje.

<img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px" />

Postavili smo projekt tako da možete da odaberete svoj omiljeni jezik, a ako ga ne pronađete na listi, slobodno zatažite da ga dodamo tako što ćete nam [poslati poruku (ticket)](https://github.com/verdaccio/verdaccio/issues/new).

[Pravac na Crowdin Verdaccio](https://crowdin.com/project/verdaccio)

## Spreman sam da dam svoj doprinos

Ako Vam razmišljanje ide u smeru *"Već sam video [repozitorijume](repositories.md) i spreman sam da odmah započnem posao"* imamo dobru vest za Vas, jer to je sledeći korak.

Naučićete sve što je potrebno za rad jer [smo spremili uputstvo namenjeno upravo tome](build.md).

Jednom kada isprobate sve moguće skripte i naučite kako da ih koristite, spremni ste da načinite sledeći korak, [**run Unit Test**](test.md).

## Lista svih saradnika. Voleli bismo da i Vas vidimo ovde !

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
