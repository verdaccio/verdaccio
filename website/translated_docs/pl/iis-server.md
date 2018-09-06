---
id: iss-server
title: "Installing on IIS server"
---
Te instrukcje zostały napisane dla systemu Windows Server 2012, usługi IIS8, [Node.js 0.12.3](https://nodejs.org/), [iisnode 0.2.16](https://github.com/tjanczuk/iisnode) oraz [verdaccio 2.1.0](https://github.com/verdaccio/verdaccio).

- Install IIS Install [iisnode](https://github.com/tjanczuk/iisnode). Make sure you install prerequisites (Url Rewrite Module & node) as explained in the instructions for iisnode.
- Utwórz nowy folder w Eksploratorze, gdzie chcesz, aby znajdowało się verdaccio. Na przykład `C:\verdaccio`. Zapisz[package.json](#packagejson), [start.js](#startjs) oraz [web.config](#webconfig) w tym folderze.
- Create a new site in Internet Information Services Manager. Możesz ją nazwać jakkolwiek chcesz. Ja nazwę ją verdaccio w tych [instrukcjach](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Określ ścieżkę do lokalizacji, w której zapisałeś wszystkie pliki i numer portu.
- Wróć do Eksploratora i daj użytkownikowi, który uruchamia pulę aplikacji, prawa do modyfikacji folderu, który został właśnie utworzony. If you've named the new site verdaccio and did not change the app pool, it's running under an ApplicationPoolIdentity and you should give the user IIS AppPool\verdaccio modify rights see instructions if you need help. (You can restrict access later if you want so that it only has modify rights on the iisnode and verdaccio\storage)
- Uruchom wiersz polecenia i wykonaj poniższe polecenia, aby pobrać verdaccio:

    cd c:\verdaccio
    npm install
    

- Upewnij się, że w Zaporze systemu Windows masz regułę ruchu przychodzącego akceptującą ruch TCP przez dany port
- To wszystko! Teraz można przejść do hosta i portu, który został określony

Chciałem, aby strona `verdaccio` była domyślną stroną w IIS, więc wykonałem następujące czynności:

- Upewniłem się, że plik .npmrc w `c:\users{yourname}` miał rejestr ustawiony jako `"registry=http://localhost/"`
- Zatrzymałem "Domyślną witrynę sieci Web" i uruchomiłem tylko witrynę "verdaccio" w IIS
- Ustawiłem powiązania na "http", adres ip na "Wszystkie nieprzypisane" na porcie 80 i obyło się bez żadnych ostrzeżeń lub monitów

These instructions are based on [Host Sinopia in IIS on Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). I had to tweak my web config as per below but you may find the original from the for mentioned link works better

Domyślny plik konfiguracji zostanie utworzony `c:\verdaccio\verdaccio\config.yaml`

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

### Rozwiązywanie problemów

- **Interfejs sieciowy nie ładuje się, gdy jest hostowany przez protokół https, ponieważ próbuje on pobrać skrypty za pomocą protokołu http.**  
    Upewnij się, że poprawnie wskazałeś `url_prefix` w konfiguracji verdaccio. Śledź [dyskusję](https://github.com/verdaccio/verdaccio/issues/622).