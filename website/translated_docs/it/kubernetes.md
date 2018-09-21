---
id: kubernetes
title: "Kubernetes"
---
Le istruzioni per sviluppare Verdaccio su un cluster Kubernetes si possono trovare nell'archivio [verdaccio/docker-example](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example). Tuttavia, il metodo raccomandato per l'installazione di Verdaccio su un cluster Kubernetes è di utilizzare [Helm](https://helm.sh). Helm è un gestore di pacchetti [Kubernetes](https://kubernetes.io) che trae molteplici vantaggi.

## Helm

### Configurare Helm

Se non si è mai usato Helm prima d'ora, è necessario configurare il controller chiamato Tiller:

```bash
helm init
```

### Installazione

Sviluppare il grafico Helm [stable/verdaccio](https://github.com/kubernetes/charts/tree/master/stable/verdaccio). In questo esempio usiamo `npm` come nome della release:

```bash
helm install --name npm stable/verdaccio
```

### Sviluppare una versione specifica

```bash
helm install --name npm --set image.tag=2.6.5 stable/verdaccio
```

### Aggiornamento di Verdaccio

```bash
helm upgrade npm stable/verdaccio
```

### Disinstallazione

```bash
helm del --purge npm
```

**Nota:** questo comando cancella tutte le risorse, inclusi i pacchetti che potresti aver pubblicato precedentemente sul registro.

### Configurazione personalizzata di Verdaccio

È possibile personalizzare la configurazione di Verdaccio utilizzando un Kubernetes *configMap*.

#### Preparazione

Copy the [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml) and adapt it for your use case:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/full.yaml -O config.yaml
```

**Note:** Make sure you are using the right path for the storage that is used for persistency:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Deploy the configMap

Deploy the `configMap` to the cluster

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Deploy Verdaccio

Now you can deploy the Verdaccio Helm chart and specify which configuration to use:

```bash
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Rancher Support

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)