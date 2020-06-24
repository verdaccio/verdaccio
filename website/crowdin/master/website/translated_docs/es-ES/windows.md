---
id: windows
title: "Instalación como un Servicio de Windows"
---

Basándome ligeramente en las instrucciones encontradas [aquí](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service). Elaboré lo siguiente y me proporcionó un servicio de instalación de verdaccio totalmente funcional:

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
    
    * Ruta: `node`
    * Directorio de Inicio: `c:\verdaccio`
    * Argumentos: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`
    
    Puede ajustar otras configuraciones de servicio en otras pestañas, según desee. Cuando termine, haga clic en el botón Servicio de Instalación
    
    * Iniciar el servicio sc iniciar verdaccio

## Uso de WinSW

* A partir del 27/10/2015, WinSW ya no está disponible en la siguiente ubicación. Por favor, siga las instrucciones anteriores de Uso de NSSM.
* Descargar [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
    * Colocar el archivo ejecutable (por ejemplo `winsw-1.9-bin.exe`) en esta carpeta (`c:\verdaccio`) y cambiarle el nombre a `verdaccio-winsw.exe`
* Crear un archivo de configuración en `c:\verdaccio`, llamado `verdaccio-winsw.xml` con la siguiente configuración `xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`.
* Instalar su servicio 
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* Comenzar su servicio 
    * `verdaccio-winsw.exe start`

Algunas de las configuraciones anteriores son más detalladas de lo que esperaba, parece como si 'workingdirectory' es ignorado, pero aparte de eso, esto funciona para mí y permite que mi instancia de verdaccio persista entre reinicios del servidor, y también que se reinicie a sí mismo de haber algún problema en el proceso de verdaccio.

## Repositorios

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)