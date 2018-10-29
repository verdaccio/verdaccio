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

* Run nssm install verdaccio At a minimum you must fill in the Application tab Path, Startup directory and Arguments fields. Assuming an install with node in the system path and a location of c:\verdaccio the below values will work:
    
    * Path: `node`
    * Startup directory: `c:\verdaccio`
    * Arguments: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`
    
    You can adjust other service settings under other tabs as desired. When you are done, click Install service button
    
    * Start the service sc start verdaccio

## Using WinSW

* As of 2015-10-27, WinSW is no longer available at the below location. Please follow the Using NSSM instructions above.
* Download [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
    * Place the executable (e.g. `winsw-1.9-bin.exe`) into this folder (`c:\verdaccio`) and rename it to `verdaccio-winsw.exe`
* Create a configuration file in `c:\verdaccio`, named `verdaccio-winsw.xml` with the following configuration `xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`.
* Install your service 
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* Start your service 
    * `verdaccio-winsw.exe start`

Some of the above config is more verbose than I had expected, it appears as though 'workingdirectory' is ignored, but other than that, this works for me and allows my verdaccio instance to persist between restarts of the server, and also restart itself should there be any crashes of the verdaccio process.

## Repositories

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)