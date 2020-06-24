---
id: protect-your-dependencies
title: "Protegiendo paquetes"
---

`verdaccio` allows you protect publish, to achieve that you will need to set up correctly your [packages access](packages).

### Configuración del paquete

Veamos por ejemplo la siguiente configuración. Tienes un conjunto de dependencias con prefijo `my-company-*` y necesitas protegerlas de anónimos o de otro usuario registrado sin credenciales.

```yaml
  'my-company-*':
    access: admin teamA teamB teamC
    publish: admin teamA
    proxy: npmjs
```

With this configuration, basically we allow to groups **admin** and **teamA** to *publish* and **teamA** **teamB** **teamC** *access* to such dependencies.

### Caso de Uso: teamD trata de acceder a la dependencia

Entonces, si yo estoy conectado como **teamD**. No debería ser capaz de acceder a todas las dependencias que cumplan con el patrón `my-company-*`.

```bash
➜ npm whoami
teamD
```

No tendré acceso a dichas dependencias y tampoco serán visibles vía web para el usuario **teamD**. Si intentas acceder, ocurrirá lo siguiente.

```bash
➜ npm install my-company-core
npm ERR! code E403
npm ERR! 403 Forbidden: webpack-1@latest
```

o con `yarn`

```bash
➜ yarn add my-company-core
yarn add v0.24.6
info No lockfile found.
[1/4] 
error Ocurrió un error inesperado: "http://localhost:5555/webpack-1: no se les permite acceder al paquete my-company-core a usuarios no registrados".
```