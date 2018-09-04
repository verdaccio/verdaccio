---
id: kubernetes
title: "Kubernetes"
---
Вы можете найти инструкции для развёртывания Verdaccio на кластере Kubernetes в репозитории [verdaccio/docker-example](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example). Однако, рекомендуемым методом установки Verdaccio на кластер Kubernetes является использование [Helm](https://helm.sh). Helm это пакетный менеджер [Kubernetes](https://kubernetes.io) который даёт некоторые приемущества.

## Helm

### Установка Helm

Если ранее вы не пользовались Helm, то вам потребуется настроить Helm контроллер называемый Tiller:

```bash
helm init
```

### Установка

Разверните Helm [stable/verdaccio](https://github.com/kubernetes/charts/tree/master/stable/verdaccio). В этом примере мы используем `npm` как имя релиза:

```bash
helm install --name npm stable/verdaccio
```

### Установка конкретной версии

```bash
helm install --name npm --set image.tag=2.6.5 stable/verdaccio
```

### Обновление Verdaccio

```bash
helm upgrade npm stable/verdaccio
```

### Удаление

```bash
helm del --purge npm
```

**Примечание:** эта команда удалит все ресурсы, включая пакеты, которые ранее были вами опубликованы в реестре.

### Пользовательская конфигурация Verdaccio

Вы можете настроить конфигурацию Verdaccio используя Kubernetes *configMap*.

#### Подготовка

Скопируйте [имеющуюся конфигурацю](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml) и адаптируйте её к своим потребностям:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/full.yaml -O config.yaml
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
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Поддержка Rancher

[Rancher](http://rancher.com/) это платформа для управления конечными контейнерами, которая делает управление им и их использование в production реально простым.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)