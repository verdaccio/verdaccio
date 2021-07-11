---
id: iss-server
title: "Installing on IIS server"
---

These instructions were written for Windows Server 2016, IIS 10, [Node.js 10.15.0](https://nodejs.org/), [iisnode 0.2.26](https://github.com/Azure/iisnode) and [verdaccio 3.11.0](https://github.com/verdaccio/verdaccio).

* Install IIS Install [iisnode](https://github.com/Azure/iisnode). Make sure you install prerequisites (Url Rewrite Module & node) as explained in the instructions for iisnode.
* Utwórz nowy folder w Eksploratorze, gdzie chcesz, aby znajdowało się verdaccio. Na przykład `C:\verdaccio`. Zapisz[package.json](#packagejson), [start.js](#startjs) oraz [web.config](#webconfig) w tym folderze.
* Utwórz nową witrynę w Menedżerze Internetowych Usług Informacyjnych. Możesz ją nazwać jakkolwiek chcesz. Ja nazwę ją verdaccio w tych [instrukcjach](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Określ ścieżkę do lokalizacji, w której zapisałeś wszystkie pliki i numer portu.
* Wróć do Eksploratora i daj użytkownikowi, który uruchamia pulę aplikacji, prawa do modyfikacji folderu, który został właśnie utworzony. Jeśli nazwałeś nową witrynę verdaccio i nie zmieniłeś puli aplikacji, działa ona pod ApplicationPoolIdentity i powinieneś dać użytkownikowi IIS AppPool\verdaccio uprawnienia modyfikacji, jeśli potrzebujesz pomocy, sprawdź instrukcje. (Możesz ograniczyć dostęp później, jeśli chcesz, aby miał on tylko uprawnienia modyfikacyjne do plików iisnode i verdaccio\magazyn)
* Uruchom wiersz polecenia i wykonaj poniższe polecenia, aby pobrać verdaccio:

````
cd c:\verdaccio
npm install
````

* Upewnij się, że w Zaporze systemu Windows masz regułę ruchu przychodzącego akceptującą ruch TCP przez dany port
* To wszystko! Teraz można przejść do hosta i portu, który został określony

Chciałem, aby strona `verdaccio` była domyślną stroną w IIS, więc wykonałem następujące czynności:

* Zatrzymałem "Domyślną witrynę sieci Web" i uruchomiłem tylko witrynę "verdaccio" w IIS
* Ustawiłem powiązania na "http", adres ip na "Wszystkie nieprzypisane" na porcie 80 i obyło się bez żadnych ostrzeżeń lub monitów

Te instrukcje są oparte na [Host Sinopia w IISw systemie Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). I had to tweak my web config as per below but you may find the original from the for mentioned link works better

Domyślny plik konfiguracji zostanie utworzony `c:\verdaccio\verdaccio\config.yaml`

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

### Alternate start.js for Verdaccio versions < v3.0

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

### Rozwiązywanie problemów
- **The web interface does not load when hosted with https as it tries to download scripts over http.** Make sure that you have enabled `X-Forwarded-Proto` in IISNode using `enableXFF`. See [the related issue](https://github.com/verdaccio/verdaccio/issues/2003).
````
<configuration>
  <system.webServer>
    <iisnode enableXFF="true" />
  </system.webServer>
</configuration>
````

