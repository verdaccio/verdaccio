---
id: iss-server
title: "Установка на IIS сервер"
---
Эта инструкция для Windows Server 2012, IIS 8, [Node.js 0.12.3](https://nodejs.org/), [iisnode 0.2.16](https://github.com/tjanczuk/iisnode) и [verdaccio 2.1.0](https://github.com/verdaccio/verdaccio).

- Установите IIS установив [iisnode](https://github.com/tjanczuk/iisnode). Убедитесь, что у вас уже установлено всё необходимое (Url Rewrite Module & node) как того требует инструкция к iisnode.
- Создайте новую директорию в Explorer, в которой вы хотите расположить verdaccio. Например `C:\verdaccio`. Сохраните [package.json](#packagejson), [start.js](#startjs) и [web.config](#webconfig) в эту директорию.
- Создайте новый сайт c помощью Internet Information Services Manager. Можете назвать его как хотите. Я буду называть его verdaccio в этих [инструкциях](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Укажите путь к сохранённым файлам и номер порта.
- Вернитесь в Explorer и дайте пользователю, который будет запускать приложение, права на изменение созданной вами ранее директории. Если вы назвали новый сайт verdaccio и не меняли пул приложения, он запустится под ApplicationPoolIdentity и вы должны дать пользователю IIS AppPool\verdaccio права на изменение, смотрите инструкцию, если вам требуется помощь. (You can restrict access later if you want so that it only has modify rights on the iisnode and verdaccio\storage)
- Start a command prompt and execute the commands below to download verdaccio:

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