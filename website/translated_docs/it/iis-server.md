---
id: iss-server
title: "Installazione sul server IIS"
---
Queste istruzioni sono state scritte per Windows Server 2012, IIS 8, [Node.js 0.12.3](https://nodejs.org/), [iisnode 0.2.16](https://github.com/tjanczuk/iisnode) and [verdaccio 2.1.0](https://github.com/verdaccio/verdaccio).

- Installare IIS e [iisnode](https://github.com/tjanczuk/iisnode). Assicurarsi di installare i prerequisiti (Url Rewrite Module & node) come spiegato nelle istruzioni per iisnode.
- Creare una nuova cartella in Explorer in cui si desidera ospitare verdaccio. Per esempio `C:\verdaccio`. Salvare in questa cartella [package.json](#packagejson), [start.js](#startjs) e [web.config](#webconfig).
- Creare un nuovo sito su Internet Information Services Manager. È possibile nominarlo come si preferisce. In queste [istruzioni](http://www.iis.net/learn/manage/configuring-security/application-pool-identities) verrà chiamato verdaccio. Specificare il percorso in cui sono stati salvati i file ed il numero della porta.
- Tornare indietro a Explorer e autorizzare l'utente che esegue il gruppo di applicazioni a poter modificare la cartella appena creata. Se si è nominato il nuovo sito verdaccio e non si è modificato il gruppo di applicazioni, allora questo sta funzionando grazie ad un'ApplicationPoolIdentity e si dovrebbe dare all'utente le autorizzazioni di poter modificare IIS AppPool\verdaccio, vedere le istruzioni in caso di aiuto. (Se si desidera è possibile restringere l'accesso successivamente, così che si ottengano solo le autorizzazioni a modificare su iisnode e verdaccio/storage)
- Iniziare un prompt dei comandi ed eseguire quelli sottostanti per scaricare verdaccio:

    cd c:\verdaccio
    npm install
    

- Make sure you have an inbound rule accepting TCP traffic to the port in Windows Firewall
- Thats it! Now you can navigate to the host and port that you specified

I wanted the `verdaccio` site to be the default site in IIS so I did the following:

- I made sure the .npmrc file in `c:\users{yourname}` had the registry set to `"registry=http://localhost/"`
- I stopped the "Default Web Site" and only start the site "verdaccio" site in IIS
- I set the bindings to "http", ip address "All Unassigned" on port 80, ok any warning or prompts

These instructions are based on [Host Sinopia in IIS on Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). I had to tweak my web config as per below but you may find the original from the for mentioned link works better

A default configuration file will be created `c:\verdaccio\verdaccio\config.yaml`

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