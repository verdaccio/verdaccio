---
id: protect-your-dependencies
title: "Protegiendo paquetes"
---
`verdaccio` allows you protect publish, to achieve that you will need to set up correctly your [packages acces](packages).

### Configuración del paquete

Veamos por instancia la siguiente configuración. Tienes un conjunto de dependencias con prefijo `my-company-*` y necesitas protegerlas de anónimos o de otro usuario registrado sin credenciales.

```yaml
  'my-company-*':
    access: admin teamA teamB teamC
    publish: admin teamA
    proxy: npmjs
```

Con esta configuración, básicamente le permitimos agrupar **administradores** y **equipoA** para * publicar* y el **equipoA** **equipoB** **equipoC** *acceder* a dichas dependencias.

### Use case: teamD try to access the dependency

Entonces, si yo estoy conectado como **equipoD**. No debería ser capaz de acceder a todas las dependencias que cumplan con el patrón `my-company-*`.

```bash
➜ npm whoami
teamD
```

I won't have access to such dependencies and also won't be visible via web for user **teamD**. If I try to access the following will happen.

```bash
➜ npm install my-company-core
npm ERR! code E403
npm ERR! 403 Forbidden: webpack-1@latest
```

or with `yarn`

```bash
➜ yarn add my-company-core
yarn add v0.24.6
info No lockfile found.
[1/4] 
error An unexpected error occurred: "http://localhost:5555/webpack-1: unregistered users are not allowed to access package my-company-core".
```