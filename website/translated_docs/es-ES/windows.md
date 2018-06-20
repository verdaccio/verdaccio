---
id: windows
title: "Instalación como un Servicio de Windows"
---
Basándose ligeramente en las instrucciones encontradas [aquí](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service). Elaboré lo siguiente y me proporcionó un servicio de instalación de verdaccio totalmente funcional:

1. Crear un directorio para Verdaccio 
    * mkdir `c:\verdaccio`
    * cd `c:\verdaccio`
2. Instalar localmente verdaccio (me encontré con problemas npm con las instalaciones globales) 
    * instalar verdaccio con npm
3. Crear su archivo `config.yaml` en esta ubicación `(c:\verdaccio\config.yaml)`
4. Configurar el Servicio de Windows

## Uso de NSSM

MÉTODO ALTERNATIVO: (el paquete WinSW faltaba cuando intenté descargarlo)

* Descargar [NSSM](https://www.nssm.cc/download/) y extraerlo

* Agregar la ruta que contiene nssm.exe a la RUTA

* Abrir un comando administrativo

* Ejecutar la instalación nssm de verdaccio. Como mínimo debe completar en la Aplicación las pestañas de Ruta, el directorio de Inicio y los campos de Argumentos. Suponiendo una instalación con nodo en la ruta del sistema y una ubicación de c:\verdaccio los siguientes valores funcionarán:
    
    * Ruta:`nodo`
    * Directorio de Inicio: `c:\verdaccio`
    * Arguments: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`
    
    You can adjust other service settings under other tabs as desired. When you are done, click Install service button
    
    * Start the service sc start verdaccio

## Using WinSW

* As of 2015-10-27, WinSW is no longer available at the below location. Please follow the Using NSSM instructions above.
* Descargar [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
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