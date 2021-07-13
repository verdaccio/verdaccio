---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the [verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example) repository. Sin embargo, el método recomendado de instalar Verdaccio en un cluster de Kubernetes es usando [Helm](https://helm.sh). Helm is a [Kubernetes](https://kubernetes.io) es un administrador de paquetes que trae muchos beneficios y ventajas.

## Helm

### Configurar Helm

Si no has usado Helm anteriormente, necesitarás configurar el controlador de Helm llamado Tiller:

```bash
helm init
```

### Instalación

> ⚠️ If you are using this helm chart, please [be aware of the migration of the repository](https://github.com/verdaccio/verdaccio/issues/1767).

Deploy the Helm [verdaccio/verdaccio](https://github.com/verdaccio/charts) chart.

### Add repository

```
helm repo add verdaccio https://charts.verdaccio.org
```

In this example we use `npm` as release name:

```bash
helm install npm verdaccio/verdaccio
```

### Desplegar una versión específica

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### Actualizando Verdaccio

```bash
helm upgrade npm verdaccio/verdaccio
```

### Desinstalar

```bash
helm uninstall npm
```

**Nota**: el comando borra todos los recursos, incluyendo los paquetes que tu podrías haber publicado anteriormente al registro.


### Configuración personalizada de Verdaccio

Puedes personalizar la configuracion de verdaccio usando un * configMap* de Kubernetes.

#### Preparando

Copy the [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml) and adapt it for your use case:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/docker.yaml -O config.yaml
```

**Nota:** Asegúrese que usa la dirección correcta para el almacenamiento que es usado por la persistencia:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Desplegar el configMap

Desplegar el ` configMap` en el cluster

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Desplegar Verdaccio

Ahora puedes desplegar Verdaccio Helm chart y especificar cual configuración usar:

```bash
helm install npm --set customConfigMap=verdaccio-config verdaccio/verdaccio
```

#### NGINX proxy body-size limit

The standard k8s NGINX ingress proxy allows for 1MB for body-size which can be increased by modifying the default deployment options according to the [documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-max-body-size):
```yaml
...

annotations:
...

    kubernetes.io/proxy-body-size: 20m
....

```

## Soporte Rancher

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
