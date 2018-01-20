---
id: what-is-verdaccio
title: "What is Verdaccio?"
---

## In a nutshell

* It's a web app based on Node.js
* It's a private npm registry
* It's a local network proxy
* It's a Pluggable application
* It's a fairly easy install and use
* We offer Docker and Kubernetes support
* It is 100% compatible with yarn, npm and pnpm
* It was born based on `sinopia@1.4.0` fork and *backward compatible*
* Verdaccio means **A green color popular in late medieval Italy for fresco painting**.

## What's a registry

* A repository for packages that implements the CommonJS Compliant Package Registry specification for reading package info
* Store npm packages
* Provide an API compatible with npm clients
* Semantic Versioning (semver) compatible

```bash
curl -v https://registry.npmjs.org/aaa

* Connected to registry.npmjs.org (151.101.12.162) port 443 (#0)

* Connection #0 to host registry.npmjs.org left intact
{"_id":"aaa","_rev":"6-ad86dfc8720569871753b5bf561f2741","name":"aaa","description":"aaa...","dist-tags":{"latest":"0.0.2"},"versions":{"0.0.1":{"name":"aaa","version":"0.0.1","description":"aaa...","main":"index.js","scripts":{"test":"test.js"},"repository":{"type":"git","url":"http:/www.google.git"},"keywords":["math"],"author":{"name":"peter"},"license":"BSD","_id":"aaa@0.0.1","dist":
{"shasum":"a04fa88ad887a70dd5429652ce23823619dfd7c3","tarball":"https://registry.npmjs.org/aaa/-/aaa-0.0.1.tgz"},"_npmVersion":"1.1.62","_npmUser":{"name":"erhu65","email":"erhu65@gmail.com"},"maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"directories":{}},"0.0.2":{"name":"aaa","version":"0.0.2","description":"aaa...","main":"index.js","scripts":{"test":"test.js"},"repository":{"type":"git","url":"http:/www.google.git"},"keywords":["math"],"author":{"name":"peter"},"license":"BSD","_id":"aaa@0.0.2","dist":
{"shasum":"acd2f632b94b0f89765e75bb7b7549ce5b01caa2","tarball":"https://registry.npmjs.org/aaa/-/aaa-0.0.2.tgz"},"_npmVersion":"1.1.62","_npmUser":{"name":"erhu65","email":"erhu65@gmail.com"},"maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"directories":{}}},"readme":"ERROR: No README.md file found!","maintainers":[{"name":"erhu65","email":"erhu65@gmail.com"}],"timmacbook-j:verdaccio.mmacbookmacbook-j:verdaccio.master.git jpicmacbook-j:verdaccio.master.git jpicmacbookmacbookmacbookmacbookmacbook
````

