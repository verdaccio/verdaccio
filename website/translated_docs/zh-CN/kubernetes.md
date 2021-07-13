---
id: kubernetes
title: "Kubernetes"
---

 You can find instructions to deploy Verdaccio on a Kubernetes cluster on the [verdaccio/docker-example](https://github.com/verdaccio/verdaccio/tree/5.x/docker-examples/kubernetes-example) repository. 然而，建议在Kubernetes集群上安装Verdaccio的方法是使用[Helm](https://helm.sh)。 Helm 是 [Kubernetes](https://kubernetes.io) 包管理者，它带来很多优点。

## Helm

### 设置Helm

如果您以前没有使用过Helm，您需要设置叫做Tiller的Helm控制器:

```bash
helm init
```

### 安装

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

### 配置特定版本

```bash
helm install npm --set image.tag=3.13.1 verdaccio/verdaccio
```

### 升级Verdaccio

```bash
helm upgrade npm verdaccio/verdaccio
```

### 卸载

```bash
helm uninstall npm
```

**请注意:** 此命令删除所有源代码，包含您之前可能已经发布到registry里的包。


### 自定义Verdaccio 配置

您可以用Kubernetes *configMap*自定义 Verdaccio 配置。

#### 准备

Copy the [existing configuration](https://github.com/verdaccio/verdaccio/blob/master/conf/docker.yaml) and adapt it for your use case:

```bash
wget https://raw.githubusercontent.com/verdaccio/verdaccio/master/conf/docker.yaml -O config.yaml
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
helm install npm --set customConfigMap=verdaccio-config verdaccio/verdaccio
```

#### NGINX proxy body-size limit

The standard k8s NGINX ingress proxy allows for 1MB for body-size which can be increased by modifying the default deployment options according to the [documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#custom-max-body-size):
```yaml
...

annotations:
...

    ...

annotations:
...

    kubernetes.io/proxy-body-size: 20m
....    
...

```

## Rancher 支持

[Rancher](http://rancher.com/) is a complete container management platform that makes managing and using containers in production really easy.

* [verdaccio-rancher](https://github.com/lgaticaq/verdaccio-rancher)
