---
id: what-is-verdaccio
title: "O que é o Verdaccio?"
---
## Em poucas palavras

* É um sistema para web feito em Node.js
* Registro privado para npm
* É um proxy para a rede local
* Pode ser estendido através de plugins
* É fácil de instalar e utilizar
* É possível utilizar junto com o Docker ou Kubernetes
* É 100% compatível com yarn, npm e pnpm
* É um fork compatível e baseado no `sinopia@1.4.0` que foi *descontinuado*
* Verdaccio significa **Uma cor verde muito popular na era Medieval Italiana usada em pinturas feitas ao estilo Afresco**.

## O que é um Registro

* É um repositório de pacotes compatíveis com a especificação CommonJS e possui metadados sobre seus pacotes
* Distribui pacotes npm
* Oferece uma API compatível para clientes npm
* Compativel com Versionamento Semântico (semver)

```bash curl -v https://registry.npmjs.org/aaa

* Connected to registry.npmjs.org (151.101.12.162) port 443 (#0)

* Connection #0 to host registry.npmjs.org left intact {"_id":"aaa","_rev":"6-ad86dfc8720569871753b5bf561f2741","name":"aaa","description":"aaa...","dist-tags":{"latest":"0.0.2"},"versions":{"0.0.1":{"name":"aaa","version":"0.0.1","description":"aaa...","main":"index.js","scripts":{"test":"test.js"},"repository":{"type":"git","url":"http:/www.google.git"},"keywords":["math"],"author":{"name":"peter"},"license":"BSD","_id":"aaa@0.0.1","dist": {"shasum":"a04fa88ad887a70dd5429652ce23823619dfd7c3","tarball":"https://registry.npmjs.org/aaa/-/aaa-0.0.1.tgz"},"_npmVersion":"1.1.62","_npmUser":{"name":"erhu65","email":"erhu65@gmail.com"},"maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"directories":{}},"0.0.2":{"name":"aaa","version":"0.0.2","description":"aaa...","main":"index.js","scripts":{"test":"test.js"},"repository":{"type":"git","url":"http:/www.google.git"},"keywords":["math"],"author":{"name":"peter"},"license":"BSD","_id":"aaa@0.0.2","dist": {"shasum":"acd2f632b94b0f89765e75bb7b7549ce5b01caa2","tarball":"https://registry.npmjs.org/aaa/-/aaa-0.0.2.tgz"},"_npmVersion":"1.1.62","_npmUser":{"name":"erhu65","email":"erhu65@gmail.com"},"maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"directories":{}}},"readme":"ERROR: No README.md file found!","maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"timmacbook-j:verdaccio.mmacbookmacbook-j:verdaccio.master.git jpicmacbook-j:verdaccio.master.git jpicmacbookmacbookmacbookmacbookmacbook ```` Context | Request Context Paragraph text XPath: /ul[3]/li[2]/p