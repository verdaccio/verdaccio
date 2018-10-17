---
id: iss-server
title: "Installation sur le serveur IIS"
---
Ces instructions ont été écrites pour le serveur Windows 2012, IIS 8, [Node.js 0.12.3](https://nodejs.org/), [iisnode 0.2.16](https://github.com/tjanczuk/iisnode) et [verdaccio 2.1.0](https://github.com/verdaccio/verdaccio).

- Installez IIS et [iisnode](https://github.com/tjanczuk/iisnode). Assurez-vous d'installer les conditions préalables (module de réécriture d'URL & nœud) comme expliqué dans les instructions pour iisnode.
- Créez un nouveau dossier dans Explorer où vous souhaitez héberger Verdaccio. Par exemple `C:\verdaccio`. Sauvgarder [package.json](#packagejson), [start.js](#startjs) et [web.config](#webconfig) dans ce fichier.
- Créez un nouveau site sur Internet Information Services Manager. Vous pouvez l’appeler comme vous voulez. Je l’appellerai verdaccio dans ces [instructions](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Spécifiez le chemin vers où vous avez enregistré les fichiers et un numéro de port.
- Retournez vers Explorer et autorisez l'utilisateur exécutant le groupe d'applications à pouvoir modifier le dossier nouvellement créé. Si vous avez nommé le nouveau site verdaccio et que vous n'avez pas modifié le groupe d'applications, cela fonctionne grâce à un ApplicationPoolIdentity et vous devez autoriser l'utilisateur à modifier IIS AppPool\verdaccio. Voir les instructions si vous avez besoin d'aide. (Si vous le souhaitez, vous pouvez restreindre l'accès ultérieurement, de sorte que vous ne disposiez que des autorisations de modification sur iisnode et verdaccio/storage)
- Lancez une invite de commande et lancez celles ci-dessous pour télécharger verdaccio:

    cd c:\verdaccio
    npm install
    

- Assurez-vous de disposer d'une règle entrante acceptant le trafic TCP sur le port du pare-feu Windows
- C'est ça! Maintenant, vous pouvez parcourir l'hôte et le port que vous avez spécifiés

Je voulais que `verdaccio` soit le site par défaut sur IIS, j'ai donc pris les mesures suivantes:

- Je me suis assuré que le fichier .nmprc dans `c:\users{yourname}` avait le registre configuré sur `"registry=http://localhost/"`
- J'ai arrêté le "site Web par défaut" et n'ai démarré que le site "verdaccio" sur IIS
- J'ai établi des connexions avec "http", l'adresse Ip "All Unassigned" sur le port 80, permettre tout avertissement ou invite

Ces instructions sont basées sur [Host Sinopia in IIS on Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). J'ai dû faire un petit ajustement de la configuration Web, comme vous pouvez le voir ci-dessous, mais vous pouvez trouver l'original à partir du lien mentionné qui fonctionne le mieux

Un fichier de configuration par défaut sera créé `c:\verdaccio\verdaccio\config.yaml`

### package.json

```json
{
  "name": "iisnode-verdaccio",
  "version": "1.0.0",
  "description": "Hosts verdaccio in iisnode",
  "main": "start.js",
  "dependencies": {
    "verdaccio": "^2.1.0"
  }
}
```

### start.js

```bash
process.argv.push('-l', 'unix:' + process.env.PORT);
require('./node_modules/verdaccio/src/lib/cli.js');
```

### web.config

```xml
<configuration>
  <system.webServer>
    <modules>
        <remove name="WebDAVModule" />
    </modules>

    <!-- indicates that the start.js file is a node.js application
    to be handled by the iisnode module -->
    <handlers>
            <remove name="WebDAV" />
            <add name="iisnode" path="start.js" verb="*" modules="iisnode" resourceType="Unspecified" requireAccess="Execute" />
            <add name="WebDAV" path="*" verb="*" modules="WebDAVModule" resourceType="Unspecified" requireAccess="Execute" />
    </handlers>

    <rewrite>
      <rules>

        <!-- iisnode folder is where iisnode stores it's logs. These should
        never be rewritten -->
        <rule name="iisnode" stopProcessing="true">
          <match url="iisnode*" />
          <action type="None" />
        </rule>

        <!-- Rewrite all other urls in order for verdaccio to handle these -->
        <rule name="verdaccio">
          <match url="/*" />
          <action type="Rewrite" url="start.js" />
        </rule>
      </rules>
    </rewrite>

    <!-- exclude node_modules directory and subdirectories from serving
    by IIS since these are implementation details of node.js applications -->
    <security>
      <requestFiltering>
        <hiddenSegments>
          <add segment="node_modules" />
        </hiddenSegments>
      </requestFiltering>
    </security>

  </system.webServer>
</configuration>
```

### Troubleshooting

- **The web interface does not load when hosted with https as it tries to download scripts over http.**  
    Make sure that you have correctly mentioned `url_prefix` in verdaccio config. Follow the [discussion](https://github.com/verdaccio/verdaccio/issues/622).