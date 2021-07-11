---
id: iss-server
title: "Инсталирање на IIS server"
---

Наведене инструкције су писане за Windows Server 2016, IIS 10, Windows Server 2016, IIS 10, [Node.js 10.15.0](https://nodejs.org/), [iisnode 0.2.26](https://github.com/Azure/iisnode) и [verdaccio 3.11.0](https://github.com/verdaccio/verdaccio).

* Install IIS Install [iisnode](https://github.com/Azure/iisnode). Make sure you install prerequisites (Url Rewrite Module & node) as explained in the instructions for iisnode.
* Направите нови фолдер у Explorer-у, који ће бити host за verdaccio. На пример `C:\verdaccio`. Уснимите [package.json](#packagejson), [start.js](#startjs) и [web.config](#webconfig) у овај фолдер.
* Направите нови сајт у Internet Information Services Manager. Можете га назвати како Вам је воља. Зваћемо га verdaccio у овим [инструкцијама](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Одаберите path где ћете снимити све фајлове и број порта.
* Вратите се у Explorer и у оквиру фолдера који сте управо креирали доделите права кориснику који покреће application pool. Ако сте именовали нови сајт као verdaccio и нисте променили app pool, он ради под ApplicationPoolIdentity и требало би да доделите права кориснику, IIS AppPool\verdaccio modify rights, погледајте инструкције ако Вам је потребна помоћ. (Касније ако пожелите, можете ограничити приступ, тако да права остају промењена само за iisnode и verdaccio\storage)
* Покрените command prompt и извршите команде наведене испод како бисте преузели verdaccio:

````
cd c:\verdaccio
npm install
````

* Постарајте се да имате добро подешено правило за прихватање TCP саобраћаја на порт, у Windows Firewall
* Thats it! Now you can navigate to the host and port that you specified

Желео сам да `verdaccio` сајт буде подразумевани сајт у IIS и зато сам урадио следеће:

* Стопирао сам "Default Web Site" и покренуо јединo "verdaccio" сајт у IIS
* Подесио сам bindings на "http", ip address "All Unassigned" на port 80, ok any warning or prompts

Дате инструкције се базирају на [Host Sinopia in IIS on Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). Треба још да чачнем my web config као што је наведено испод, али може се десити да наведени линк заправо ради боље

Креираће се подразумевана конфигурација `c:\verdaccio\verdaccio\config.yaml`

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

### Промените start.js за верзије Verdaccio-а < v3.0

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

        <!-- iisnode folder is where iisnode stores it's logs. These should
        never be rewritten -->
        <rule name="iisnode" stopProcessing="true">
            <match url="iisnode*" />
            <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
            <action type="None" />
        </rule>

        <!-- Rewrite all other urls in order for verdaccio to handle these -->
        <rule name="verdaccio">
            <match url="/*" />
            <conditions logicalGrouping="MatchAll" trackAllCaptures="false" />
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
````

### Проблеми (Troubleshooting)
- **The web interface does not load when hosted with https as it tries to download scripts over http.** Make sure that you have enabled `X-Forwarded-Proto` in IISNode using `enableXFF`. See [the related issue](https://github.com/verdaccio/verdaccio/issues/2003).
````
<configuration>
  <system.webServer>
    <iisnode enableXFF="true" />
  </system.webServer>
</configuration>
````

