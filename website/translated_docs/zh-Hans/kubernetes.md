---
id: kubernetes
title: "Kubernetes"
---
您可以在[verdaccio/docker-例子](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example)资源库找到在Kubernetes群集中配置Verdaccio的指南。 然而，推荐在Kubernetes集群上安装Verdaccio的方法是用[Helm](https://helm.sh)。 Helm 是 [Kubernetes](https://kubernetes.io) package管理者，它带来好多优点。

## Helm

### 设置Helm

如果您以前没有使用过Helm， 您需要设置叫做Tiller的Helm控制器:

```bash
helm init
```

### 安装

配置Helm [stable/verdaccio](https://github.com/kubernetes/charts/tree/master/stable/verdaccio) chart。在这个例子里，我们用 `npm` 作为发行名称:

```bash
helm install --name npm stable/verdaccio
```

### 配置特定版本

```bash
helm install --name npm --set image.tag=2.6.5 stable/verdaccio
```

### 升级Verdaccio

```bash
helm upgrade npm stable/verdaccio
```

### 卸载

```bash
helm del --purge npm
```

**Note:** this command delete all the resources, including packages that you may have previously published to the registry.

### Custom Verdaccio configuration

You can customize the Verdaccio configuration using a Kubernetes *configMap*.

#### Prepare

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