---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the [verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example) repository. Однако, рекомендуемым методом установки Verdaccio на кластер Kubernetes является использование [Helm](https://helm.sh). Helm это пакетный менеджер [Kubernetes](https://kubernetes.io) который даёт некоторые приемущества.

## Helm

### Установка Helm

Если ранее вы не пользовались Helm, то вам потребуется настроить Helm контроллер называемый Tiller:

```bash
helm init
```

### Установка

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

### Установка конкретной версии

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### Обновление Verdaccio

```bash
helm upgrade npm verdaccio/verdaccio
```

### Удаление

```bash
helm uninstall npm
```

**Примечание:** эта команда удалит все ресурсы, включая пакеты, которые ранее были вами опубликованы в реестре.


### Пользовательская конфигурация Verdaccio

Вы можете настроить конфигурацию Verdaccio используя Kubernetes *configMap*.

#### Подготовка

Скопируйте [имеющуюся конфигурацию](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml) и адаптируйте её для себя:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/docker.yaml -O config.yaml
```

**Примечание:** Убедитесь, что вы используете правильный путь для постоянного хранилища:

```yaml
storage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### Применение configMap

Для применения `configMap` к нашему кластеру

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### Разворачивание Verdaccio

Сейчас вы можете развернуть Verdaccio Helm пакет и указать, с какой конфигурацией его нужно развернуть: use:

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

## Поддержка Rancher

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
