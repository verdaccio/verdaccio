---
id: iss-server
title: "Fifi sori olupese IIS"
---

Awọn ilana wọnyi ni a kọ fun Windows Server 2016, IIS 10, [Node.js 10.15.0](https://nodejs.org/), [iisnode 0.2.26](https://github.com/Azure/iisnode) and [verdaccio 3.11.0](https://github.com/verdaccio/verdaccio).

* Install IIS Install [iisnode](https://github.com/Azure/iisnode). Make sure you install prerequisites (Url Rewrite Module & node) as explained in the instructions for iisnode.
* Ṣẹda foda tuntun ni Explorer ni ibi ti o fẹ gbalejo verdaccio. Fun apẹẹrẹ `C:\verdaccio`. Fi [package.json](#packagejson), [start.js](#startjs) and [web.config](#webconfig) pamọ sinu foda yii.
* Ṣẹda aaye ayelujara tuntun kan ni Alakoso Awọn Iṣẹ Alaye Ayelujara. O le fun lorukọ eyikeyi ti o fẹ. Mo ma pe ni verdaccio ninu [awọn alaye yii](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Yan pato ọna ibi ti o ti fi gbogbo awọn faili ati nọmba ibudo kan pamọ si.
* Pada lọ si Explorer ki o si fun olumulo ti o n lo awọn ẹtọ atunṣe adagun ohun elo si foda ti o sẹsẹ ṣẹda. Ti o ba ti fun aaye ayelujara tuntun naa ni orukọ verdaccio ati ti o ko yi adagun ohun elo naa pada, o n ṣiṣẹ labẹ ApplicationPoolIdentity kan atipe o yẹ ki o fun olumulo naa ni awọn ẹtọ atunṣe IIS AppPool\verdaccio wo awọn ilana ti o ba nilo iranlọwọ. (O le se idena wiwọle to ba ya ti o ba fẹ to fi ma jẹ wipe awọn ẹtọ atunṣe nikan ni o ma ni lori iisnode ati verdaccio\storage)
* Bẹrẹ aṣẹ kan tọ ati ki o si ṣe abayọri awọn aṣẹ isalẹ yii lati gba verdaccio sori ẹrọ:

````
cd c:\verdaccio
npm install
````

* Ri daju pe o ni ofin to n wọle bọ to tẹwọgba abẹwo TCP si ibudo naa ni Awọn aabo ayelujara ti Windows
* Thats it! Now you can navigate to the host and port that you specified

Mo fẹ jẹ ki aaye ayelujara `verdaccio` jẹ aaye ayelujara atilẹwa ni IIS fun idi eyi mo se awọn ohun wọnyii:

* Mo da "Aaye Ayelujara Atilẹwa" duro atipe mo kan bẹrẹ aaye ayelujara "verdaccio" nikan ni IIS
* Mo seto awọn isopọ naa si "http", adirẹsi ip "Gbogbo eyi ti ko jẹ Pinpin" lori ibudo 80, fọwọsi eyikeyi ikilọ tabi awọn ibeere

Awọn itọsọna wọnyi da lori [Host Sinopia ni IIS lori Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). Mo ni lati ṣe ayipada iṣeto wẹẹbu mi gẹgẹbi isalẹ yii ṣugbọn o le ri ojulowo naa lati ọdọ itọkasi asopọ to n ṣiṣẹ daradara

Faili iṣeto atilẹwa kan maa jẹ ṣiṣẹda `c:\verdaccio\verdaccio\config.yaml`

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

### Ọna start.js miran fun awọn ẹya Verdaccio < v3.0

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

### Titu laasigbo sita
- **The web interface does not load when hosted with https as it tries to download scripts over http.** Make sure that you have enabled `X-Forwarded-Proto` in IISNode using `enableXFF`. See [the related issue](https://github.com/verdaccio/verdaccio/issues/2003).
````
<configuration>
  <system.webServer>
    <iisnode enableXFF="true" />
  </system.webServer>
</configuration>
````

