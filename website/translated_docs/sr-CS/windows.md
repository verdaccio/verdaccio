---
id: windows
title: "Instalirajte kao Windows Service"
---
Ugrubo bazirano na uputstvima koja se mogu pronaći [ovde](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service). Napravili smo primer verdaccio servis instalacije koja radi kao sat. Švajcarski:

1. Kreirajte direktorijum za verdaccio 
    * mkdir `c:\verdaccio`
    * cd `c:\verdaccio`
2. Instalirajte verdaccio lokalno (događaju se problemi sa npm ako je instalacija globalna) 
    * npm install verdaccio
3. Kreirajte svoj `config.yaml` falj na ovoj lokaciji `(c:\verdaccio\config.yaml)`
4. Windows Service Setup

## Korišćenje NSSM

ALTERNATIVNI METOD: (WinSW paket je nedostajao kada je jedan od naših saradnika pokušao da ga preuzme)

* Preuzmite [NSSM](https://www.nssm.cc/download/) i ekstrakujte

* Dodajte putanju do nssm.exe u PATH

* Otvorite administrative command

* Pokrenite nssm install verdaccio Kao minimum, morate popuniti polja: Application tab Path, Startup directory i Arguments. Ako pretpostavimo da ste instalirali sa node u system path na lokaciju c:\verdaccio trebalo bi da funkcioniše:
    
    * Path: `node`
    * Startup directory: `c:\verdaccio`
    * Arguments: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`
    
    Možete podesite druga servisna podešavanja u okviru ostalih tabova po sopstvenim željama. Kada završite, kliknite dugme Install service
    
    * Pokrenite service sc, pokrenite verdaccio

## Korišćenje WinSW

* Od 2015-10-27, WinSW više nije dostupan na navedenoj lpkaciji. Pratite instrukcije date u Using NSSM.
* Preuzmite [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
    * Postavite exe (primer, `winsw-1.9-bin.exe`) u ovaj folder (`c:\verdaccio`) i preimenujte u `verdaccio-winsw.exe`
* Napravite fajl za konfigurisanje `c:\verdaccio`, nazvan `verdaccio-winsw.xml` sa sledećom konfiguracijom `xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`.
* Instalirajte servis 
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* Pokrenite servis 
    * `verdaccio-winsw.exe start`

Some of the above config is more verbose than I had expected, it appears as though 'workingdirectory' is ignored, but other than that, this works for me and allows my verdaccio instance to persist between restarts of the server, and also restart itself should there be any crashes of the verdaccio process.

## Repozitorijumi

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)