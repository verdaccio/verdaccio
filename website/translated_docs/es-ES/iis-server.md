---
id: iss-servidor
title: "Instalación en servidor IIS"
---
Estas instrucciones fueron escritas para Windows Server 2012, IIS 8, [Node.js 0.12.3](https://nodejs.org/), [iisnode 0.2.16](https://github.com/tjanczuk/iisnode) y [verdaccio 2.1.0](https://github.com/verdaccio/verdaccio).

- Instala IIS Instala [iisnode](https://github.com/tjanczuk/iisnode). Asegúrate de instalar los requerimientos (Url Rewrite Module & node) como se explicó en las instrucciones para iisnode.
- Crea una nueva carpeta en Explorer en donde deseas alojar a Verdaccio. Por ejemplo `C:\verdaccio`. Guardar [package.json](#packagejson), [start.js](#startjs) y [web.config](#webconfig) en esta carpeta.
- Crea un nuevo sitio en Administrador de Servicios de Información de Internet. Puedes ponerle el nombre que quieras. Lo llamaré Verdaccio en estas [instrucciones](http://www.iis.net/learn/manage/configuring-security/application-pool-identities). Especifica la ruta en donde guardaste todos los archivos y un número de puerto.
- Regresa a Explorer y otorgale al usuario que ejecuta el grupo de aplicaciones derechos para modificar la carpeta que acabas de crear. Si has nombrado el nuevo sitio verdaccio y no cambiaste el grupo de aplicaciones, está funcionado gracias a un ApplicationPoolIdentity y deberías otorgarle al usuario derechos para modificar IIS AppPool\verdaccio mira las instrucciones si necesitas ayuda. (Puede restringir el acceso más adelante si lo deseas para que así solo tenga derechos para modificar en el iisnode y verdaccio\storage)
- Empieza una línea de comando y ejecuta los comandos que aparecen debajo para descargar verdaccio:

    cd c:\verdaccio
    npm install
    

- Asegúrate de tener una regla de entrada que acepte Tráfico de TCP al puerto en Windows Firewall
- ¡Y listo! Ahora puedes navegar al host y al puerto que especificaste

Quería que la página `verdaccio` fuese la página predeterminada en IIS así que hice lo siguiente:

- Me aseguré que el archivo .npmrc en `c:\users{yourname}` tuviese el registro configurado a `"registry=http://localhost/"`
- Detuve el "Sitio Web Predeterminado" y solo empiezo el sitio "verdaccio" en IIS
- Establecí los enlaces a "http", dirección de ip "All Unassigned" en el puerto 80, ok cualquier advertencia o carácter de comando

Estas instrucciones se basan en [Anfitrión Sinopia en IIS en Windows](https://gist.github.com/HCanber/4dd8409f79991a09ac75). Tuve que hacer pequeños ajustes a mi configuración web como se puede ver debajo pero puedes encontrar el original del enlace mencionado el cual funciona mejor

Un archivo de configuración predeterminado será creado `c:\verdaccio\verdaccio\config.yaml`

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

### Solución de problemas

- **La interfaz web no carga cuando se aloja con https ya que trata de descargar scripts sobre http.**  
    Asegúrate de que hayas mencionado correctamente `url_prefix` en la configuración de Verdaccio. Sigue la [conversación](https://github.com/verdaccio/verdaccio/issues/622).