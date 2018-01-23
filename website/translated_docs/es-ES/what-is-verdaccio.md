---
id: what-is-verdaccio
title: Qué es Verdaccio?
---
## En pocas palabras

* Es una aplicación web basada en Node.js
* Es un registro de npm privado
* Es un servidor proxy local
* Es una aplicación que se puede extender
* Es muy fácil de usar e instalar
* Ofrecemos soporte en Docker y Kubernetes
* Es 100% compatible con yarn, npm y pnpm
* Proyecto que nació basado en una bifurcación de `sinopia@1.4.0` y completamente compatible
* Verdaccio significa **Un color verde popular en la Italia medieval para la pintura en fresco**.

## Qué es un registro

* Es un repositorio para paquetes que implementan la especificación CommonJS para la lectura de información de paquetes
* Almacena paquetes de Node
* Provee un API compatible con clientes npm
* Compatible con (semver) Versionado Semántico

```bash curl -v https://registry.npmjs.org/aaa

* Connected to registry.npmjs.org (151.101.12.162) port 443 (#0)

* Connection #0 to host registry.npmjs.org left intact {"_id":"aaa","_rev":"6-ad86dfc8720569871753b5bf561f2741","name":"aaa","description":"aaa...","dist-tags":{"latest":"0.0.2"},"versions":{"0.0.1":{"name":"aaa","version":"0.0.1","description":"aaa...","main":"index.js","scripts":{"test":"test.js"},"repository":{"type":"git","url":"http:/www.google.git"},"keywords":["math"],"author":{"name":"peter"},"license":"BSD","_id":"aaa@0.0.1","dist": {"shasum":"a04fa88ad887a70dd5429652ce23823619dfd7c3","tarball":"https://registry.npmjs.org/aaa/-/aaa-0.0.1.tgz"},"_npmVersion":"1.1.62","_npmUser":{"name":"erhu65","email":"erhu65@gmail.com"},"maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"directories":{}},"0.0.2":{"name":"aaa","version":"0.0.2","description":"aaa...","main":"index.js","scripts":{"test":"test.js"},"repository":{"type":"git","url":"http:/www.google.git"},"keywords":["math"],"author":{"name":"peter"},"license":"BSD","_id":"aaa@0.0.2","dist": {"shasum":"acd2f632b94b0f89765e75bb7b7549ce5b01caa2","tarball":"https://registry.npmjs.org/aaa/-/aaa-0.0.2.tgz"},"_npmVersion":"1.1.62","_npmUser":{"name":"erhu65","email":"erhu65@gmail.com"},"maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"directories":{}}},"readme":"ERROR: No README.md file found!","maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"timmacbook-j:verdaccio.mmacbookmacbook-j:verdaccio.master.git jpicmacbook-j:verdaccio.master.git jpicmacbookmacbookmacbookmacbookmacbook ````