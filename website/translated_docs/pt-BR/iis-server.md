---
id: iss-server
title: "Instalando em um Servidor ISS"
---

Estas instruções foram escritas para o Windows Server 2016, IIS 10, [Node.js 10.15.0](https://nodejs.org/), [iisnode 0.2.26](https://github.com/Azure/iisnode) e [verdaccio 3.11.0](https://github.com/verdaccio/verdaccio).

* Instale o IIS Install [iisnode](https://github.com/Azure/iisnode). Certifique-se de instalar os pré-requisitos (Url Rewrite Module & node), conforme explicado nas instruções do iisnode.
* Crie uma nova pasta no Explorer onde você deseja hospedar o verdaccio. Por exemplo `C:\verdaccio`. Salve o [package.json](#packagejson), [start.js](#startjs) e [web.config](#webconfig) nesta pasta.
* Crie um novo site no Gerenciador de Serviços de Informações da Internet. Você pode nomea-lo como quiser. Chamarei de verdaccio nestas [instruções](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Especifique o caminho onde você salvou todos os arquivos e um número de porta.
* Volte para o Explorer e forneça, ao usuário que executa a pool de aplicações, direitos de modificação para a pasta recém criada. Se você nomeou o novo site como verdaccio e não alterou a pool de aplicações, ele está sendo executado sob uma ApplicationPoolIdentity e você deve conceder ao usuário direitos de modificação de IIS AppPool\verdaccio, veja as instruções se precisar de ajuda. (Você pode restringir o acesso mais tarde caso o queira, para que ele tenha apenas direitos de modificação no iisnode e no verdaccio\storage)
* Inicie um prompt de comando e execute os comandos abaixo para fazer o download do verdaccio:

````
cd c:\verdaccio
npm install
````

* Verifique se você tem uma regra de entrada aceitando o tráfego TCP na porta do Firewall do Windows
* E é isto! Agora você pode navegar para o host e a porta que você especificou

Eu queria que o site do `verdaccio` fosse o site padrão no IIS, então fiz o seguinte:

* I stopped the "Default Web Site" and only start the site "verdaccio" site in IIS
* I set the bindings to "http", ip address "All Unassigned" on port 80, ok any warning or prompts

Estas instruções são baseadas em [Host Sinopia in IIS on Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). Eu tive que fazer pequenos ajustes na minha configuração web, como você pode ver abaixo, mas você pode encontrar o original do link mencionado que funciona melhor

Um arquivo de configuração padrão será criado `c:\verdaccio\verdaccio\config.yaml`

### package.json

````json
{
  "name": "iisnode-verdaccio",
  "version": "1.0.0",
  "description": "Hosts verdaccio in iisnode",
  "main": "start.js",
  "dependencies": {
    "verdaccio": "^3.11.0"
  }
}
````

### start.js

````bash
process.argv.push('-l', 'unix:' + process.env.PORT, '-c', './config.yaml');
require('./node_modules/verdaccio/build/lib/cli.js');
````

### Start.js alternativos para versões do Verdaccio < v3.0

````bash
process.argv.push('-l', 'unix:' + process.env.PORT);
require('./node_modules/verdaccio/src/lib/cli.js');
````

### web.config

````xml
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

        <!-- iisnode folder is where iisnode stores it's logs. Estes nunca
        deverão ser reescritos -->
        <rule name="iisnode" stopProcessing="true">
            <match url="iisnode*" />
            <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
            <action type="None" />
        </rule>

        <!-- Reescreva todas as outras URLs para que o verdaccio possa lidar com estes -->
        <rule name="verdaccio">
            <match url="/*" />
            <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
            <action type="Rewrite" url="start.js" />
        </rule>
      </rules>
    </rewrite>

    <!-- exclui o diretório e os subdiretórios node_modules da veiculação
     pelo IIS, uma vez que estes são detalhes de implementação de aplicativos node.js -->
    <security>
      <requestFiltering>
        <hiddenSegments>
          <add segment="node_modules" />
        </hiddenSegments>
      </requestFiltering>
    </security>

  </system.webServer>
</configuration>
````

### Troubleshooting
- **The web interface does not load when hosted with https as it tries to download scripts over http.** Make sure that you have enabled `X-Forwarded-Proto` in IISNode using `enableXFF`. See [the related issue](https://github.com/verdaccio/verdaccio/issues/2003).
````
<configuration>
  <system.webServer>
    <iisnode enableXFF="true" />
  </system.webServer>
</configuration>
````

