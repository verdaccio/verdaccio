---
id: iss-server
title: "IIS server上进行安装"
---

These instructions were written for Windows Server 2016, IIS 10, [Node.js 10.15.0](https://nodejs.org/), [iisnode 0.2.26](https://github.com/Azure/iisnode) and [verdaccio 3.11.0](https://github.com/verdaccio/verdaccio).

- Install IIS Install [iisnode](https://github.com/Azure/iisnode). Make sure you install prerequisites (Url Rewrite Module & node) as explained in the instructions for iisnode.
- 在要承载verdaccio的资源管理器中创建一个新文件夹。 例如 `C:\verdaccio`。 在此文件夹里保存 [package.json](#packagejson), [start.js](#startjs) 和 [web.config](#webconfig) 。
- 在因特网信息服务管理器中创建一个新站点。 您可以随意给它命名。 我将在这些[用法说明](http://www.iis.net/learn/manage/configuring-security/application-pool-identities)中称它为verdaccio。 指定保存所有文件和端口号的路径。
- 返回到资源管理器中，把对您刚创建的文件夹的修改权限赋予给运行此应用程序池的用户。 如果您已命名此站点为verdaccio，并没有修改该应用程序池，它正在ApplicationPoolIdentity下运行，您就应该给用户 IIS AppPool\verdaccio修改权限。如果您需要帮助的话，请参照用法说明。 （如果需要，可以在日后限制访问，这样它只有 iisnode 和verdaccio\storage的修改权限）
- 启动命令行并执行以下命令来下载verdaccio:

    cd c:\verdaccio
    npm install
    

- 请确保您有入站规则来接受TCP流量到Windows防火墙的端口
- 就这样！现在您可以导航到您指定的主机和端口

我希望 `verdaccio`站点成为IIS中默认的站点，因此我执行了以下操作：

- 我中止“默认网站”，并且只在IIS 里启动"verdaccio"站点
- 我将端口80绑定设置为"http", ip 地址为"全部未定义"，ok 任何警告或提示。

这些指南是基于[Host Sinopia in IIS on Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75)。 我不得不依照以下调整我的网页配置，但是您可能发现上述提到链接里的原始配置可以更好作业

将创建默认配置文件`c:\verdaccio\verdaccio\config.yaml`

### package.json

```json
{
  "name": "iisnode-verdaccio",
  "version": "1.0.0",
  "description": "Hosts verdaccio in iisnode",
  "main": "start.js",
  "dependencies": {
    "verdaccio": "^3.11.0"
  }
}
```

### start.js

```bash
process.argv.push('-l', 'unix:' + process.env.PORT, '-c', './config.yaml'); 
require('./node_modules/verdaccio/build/lib/cli.js');
```

### Alternate start.js for Verdaccio versions < v3.0

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
```

### 故障排除

- **以https 为主机的网页界面无法加载，因为它总是尝试从 http下载脚本。**  
    请确保您在verdaccio配置里正确提到`url_prefix`。请跟随 [讨论](https://github.com/verdaccio/verdaccio/issues/622)。