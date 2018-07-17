---
id: kubernetes
title: "Kubernetes"
---
您可以在[verdaccio/docker-例子](https://github.com/verdaccio/docker-examples/tree/master/kubernetes-example)资源库找到在Kubernetes群集中配置Verdaccio的指南。 然而，建议在Kubernetes集群上安装Verdaccio的方法是使用[Helm](https://helm.sh)。 Helm 是 [Kubernetes](https://kubernetes.io) 包管理者，它带来很多优点。

## Helm

### 设置Helm

如果您以前没有使用过Helm，您需要设置叫做Tiller的Helm控制器:

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

**请注意:** 此命令删除所有源代码，包含您之前可能已经发布到registry里的包。

### 自定义Verdaccio 配置

您可以用Kubernetes *configMap*自定义 Verdaccio 配置。

#### 准备

复制 [现有配置](https://github.com/verdaccio/verdaccio/blob/master/conf/full.yaml)并将其调整为您所需要的:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/full.yaml -O config.yaml
```

**请注意:** 请确保您使用的是持续存储的正确路径:

```yaml
torage: /verdaccio/storage/data
auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
```

#### 配置configMap

配置`configMap`到集群

```bash
kubectl create configmap verdaccio-config --from-file ./config.yaml
```

#### 配置Verdaccio

现在您可以配置Verdaccio Helm chart 并指定使用哪个配置:

```bash
helm install --name npm --set customConfigMap=verdaccio-config stable/verdaccio
```

## Rancher 支持

[Rancher](http://rancher.com/) 是一个完整的容器管理平台，它使得在生产中管理和使用容器非常容易。

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)