---
id: windows
title: Installing As a Windows Service
---
Loosely based upon the instructions found [here](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service). I crafted the following and it provided me with a fully working verdaccio service installation:

1. Create a directory for verdaccio 
    * mkdir `c:\verdaccio`
    * cd `c:\verdaccio`
2. Install verdaccio locally (I ran into npm issues with global installs) 
    * npm install verdaccio
3. Create your `config.yaml` file in this location `(c:\verdaccio\config.yaml)`
4. Windows Service Setup

## Using NSSM

ALTERNATIVE METHOD: (WinSW package was missing when I tried to download it)

* Download [NSSM](https://www.nssm.cc/download/) and extract

* Add the path that contains nssm.exe to the PATH

* Open an administrative command

* Run nssm install verdaccio At a minimum you must fill in the Application tab Path, Startup directory and Arguments fields. Assuming an install with node in the system path and a location of c:\verdaccio the below values will work:
    
    * Path: `node`
    * Startup directory: `c:\verdaccio`
    * Arguments: `c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml`
    
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