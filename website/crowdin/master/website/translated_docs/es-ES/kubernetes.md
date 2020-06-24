---
id: kubernetes
title: "Kubernetes"
---

 Puedes encontrar las instrucciones para desplegar Verdaccio en un cluster de Kubernetes en el repositorio [verdaccio/docker-example](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example). Sin embargo, el método recomendado de instalar Verdaccio en un cluster de Kubernetes es usando [Helm](https://helm.sh). Helm is a [Kubernetes](https://kubernetes.io) es un administrador de paquetes que trae muchos beneficios y ventajas.

## Helm

### Configurar Helm

Si no has usado Helm anteriormente, necesitarás configurar el controlador de Helm llamado Tiller:

```bash
helm init
```

### Instalación

Desplegar Helm [stable/verdaccio](https://github.com/kubernetes/charts/tree/master/stable/verdaccio) chart. En este ejemplo usamos `npm` como nombre de lanzamiento:

```bash
helm install --name npm stable/verdaccio
```

### Desplegar una versión específica

```bash
helm install --name npm --set image.tag=2.6.5 stable/verdaccio
```

### Actualizando Verdaccio

```bash
helm upgrade npm stable/verdaccio
```

### Desinstalar

```bash
helm del --purge npm
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
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Soporte Rancher

[Rancher](http://rancher.com/) es una completa plataforma para la administración de contenedores en producción muy fácil de usar.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)