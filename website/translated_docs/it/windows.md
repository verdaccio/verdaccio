---
id: windows
title: "Installing As a Windows Service"
---
Loosely based upon the instructions found [here](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service). Ho elaborato ciò che segue e mi ha fornito un servizio di installazione per verdaccio completamente funzionante:

1. Creare una directory per verdaccio 
    * mkdir `c:\verdaccio`
    * cd `c:\verdaccio`
2. Installare verdaccio localmente (ho incontrato problemi con npm con le installazioni generali) 
    * npm install verdaccio
3. Creare il file `config.yaml` in questa posizione `(c:\verdaccio\config.yaml)`
4. Configurare Windows Service

## Utilizzo di NSSM

METODO ALTERNATIVO: (il pacchetto WinSW non era presente quando ho provato a scaricarlo)

* Scaricare [NSMM](https://www.nssm.cc/download/) ed estrarlo

* Aggiungere il percorso che contiene nssm.exe al PERCORSO

* Aprire un comando amministrativo

* Run nssm install verdaccio At a minimum you must fill in the Application tab Path, Startup directory and Arguments fields. Supponendo un'installazione con nodo nel percorso di sistema ed una posizione di c:\verdaccio, i valori qui sotto funzioneranno:
    
    * Percorso: `node`
    * Directory di avvio: `c:\verdaccio`
    * Argomenti: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`
    
    È possibile adattare configurazioni di servizio alternative sotto altre schede, come si preferisce. Una volta terminato, cliccare sul pulsante installa servizio
    
    * Avviare il servizio sc start verdaccio

## Utilizzo di WinSW

* A partire dal 27/10/2015, WinSW non è più disponibile nella posizione seguente. Si prega di seguire le istruzioni di utilizzo NSSM scritte sopra.
* Scaricare [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
    * Place the executable (e.g. `winsw-1.9-bin.exe`) into this folder (`c:\verdaccio`) and rename it to `verdaccio-winsw.exe`
* Creare un file di configurazione in `c:\verdaccio`, denominato `verdaccio-winsw.xml` con la seguente configurazione `xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`.
* Install your service 
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* Start your service 
    * `verdaccio-winsw.exe start`

Some of the above config is more verbose than I had expected, it appears as though 'workingdirectory' is ignored, but other than that, this works for me and allows my verdaccio instance to persist between restarts of the server, and also restart itself should there be any crashes of the verdaccio process.

## Repositories

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)