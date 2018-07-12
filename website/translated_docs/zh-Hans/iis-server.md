---
id: iss-server
title: "IIS server上进行安装"
---
这些用法说明是为Windows Server 2012, IIS 8, [Node.js 0.12.3](https://nodejs.org/), [iisnode 0.2.16](https://github.com/tjanczuk/iisnode) 和[verdaccio 2.1.0](https://github.com/verdaccio/verdaccio)所写。

- 安装IIS Install [iisnode](https://github.com/tjanczuk/iisnode)。请确保您依照iisnode用法说明中所说的安装先决条件 (Url 重写模块 & 节点) 。
- 在要承载verdaccio的资源管理器中创建一个新文件夹。 例如 `C:\verdaccio`。 在此文件夹里保存 [package.json](#packagejson), [start.js](#startjs) 和 [web.config](#webconfig) 。
- 在因特网信息服务管理器中创建一个新站点。 您可以随意给它命名。 我将在这些[用法说明](http://www.iis.net/learn/manage/configuring-security/application-pool-identities)中称它为verdaccio。 指定保存所有文件和端口号的路径。
- 返回到资源管理器中，把对您刚创建的文件夹的修改权限赋予给运行此应用程序池的用户。 如果您已命名此站点为verdaccio，并没有修改该应用程序池，它正在ApplicationPoolIdentity下运行，您就应该给用户 IIS AppPool\verdaccio修改权限。如果您需要帮助的话，请参照用法说明。 （如果需要，可以在日后限制访问，这样它只有 iisnode 和verdaccio\storage的修改权限）
- 启动命令行并执行以下命令来下载verdaccio:

    cd c:\verdaccio
    npm install
    

- 请确保您有入站规则来接受TCP流量到Windows防火墙的端口
- 就这样！现在您可以导航到您指定的主机和端口

我要 `verdaccio`站点成为IIS中默认的站点，因此我执行以下操作：

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