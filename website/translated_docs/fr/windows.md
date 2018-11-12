---
id: windows
title: "Installation en tant que service Windows"
---
Librement basé sur les instructions trouvées [ici](http://asysadmin.tumblr.com/post/32941224574/running-nginx-on-windows-as-a-service). J'ai élaboré ce qui suit, ce qui m'a fourni un service d'installation de verdaccio entièrement fonctionnel:

1. Créer un répertoire pour verdaccio 
    * mkdir `c:\verdaccio`
    * cd `c:\verdaccio`
2. Installer verdaccio localement (j'ai rencontré des problèmes avec npm avec des installations générales) 
    * npm install verdaccio
3. Créer votre fichier `confi.yaml` dans cet emplacement `(c:\verdaccio\config.yaml)`
4. Configurer le service Windows

## Utilisation de NSSM

MÉTHODE ALTERNATIVE: (le paquet WinSW n'était pas présent lorsque j'ai essayé de le télécharger)

* Téléchargez puis extrayez [NSSM](https://www.nssm.cc/download/)

* Ajoutez le chemin qui contient nssm.exe au PATH

* Ouvrez une commande administrative

* Exécutez nssm install verdaccio. Vous devez au moins entrer le dossier de démarrage et les champs Arguments dans le chemin de l'onglet Application. En supposant une installation avec noeud dans le chemin système et un emplacement de c:\verdaccio, les valeurs ci-dessous fonctionneront:
    
    * Path: `node`
    * Répertoire de démarrage: `c:\verdaccio`
    * Arguments: `c:\verdaccio\node_modules\verdaccio\build\lib\cli.js -c c:\verdaccio\config.yaml`
    
    Si vous le souhaitez, il est possible d'adapter d'autres configurations de service sous d'autres onglets. Une fois terminé, cliquez sur le bouton d'installation
    
    * Démarrer le service sc start verdaccio

## Utilisation de WinSW

* À compter du 27/10/2015, WinSW n'est plus disponible à l'emplacement suivant. Veuillez suivre les instructions d'utilisation NSSM écrites ci-dessus.
* Téléchargez [WinSW](http://repo.jenkins-ci.org/releases/com/sun/winsw/winsw/) 
    * Placez l'exécutable (par exemple `winsw-1.9-bin.exe`) dans ce dossier (`c:\verdaccio`) et renommez-le `verdaccio-winsw.exe`
* Créez un fichier de configuration dans `c:\verdaccio`, nommé `verdaccio-winsw.xml` avec la configuration suivante`xml verdaccio verdaccio verdaccio node c:\verdaccio\node_modules\verdaccio\src\lib\cli.js -c c:\verdaccio\config.yaml roll c:\verdaccio`.
* Installez votre service 
    * `cd c:\verdaccio`
    * `verdaccio-winsw.exe install`
* Démarrez votre service 
    * `verdaccio-winsw.exe start`

Certaines des configurations ci-dessus sont plus détaillées que prévu. Il semble cependant que le 'workingdirectory' soit ignoré, à part cela, ceci fonctionne et permet, dans mon cas, que Verdaccio continue de fonctionner entre les redémarrages du serveur, en plus il redémarre de manière autonome en cas d’échec du processus de verdaccio.

## Référentiels

* [verdaccio-deamon-windows](https://github.com/davidenke/verdaccio-deamon-windows)