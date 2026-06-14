# Verdaccio 7 on Kubernetes with Helm

Deploy Verdaccio 7 to a Kubernetes cluster using the official
[Verdaccio Helm chart](https://github.com/verdaccio/charts).

The chart is maintained in its own repository; this example only provides a
[`values.yaml`](./values.yaml) that pins the Verdaccio 7 image (`7.x-next`),
enables persistence and ships a minimal inline configuration.

## Prerequisites

- A running Kubernetes cluster (e.g. [minikube](https://minikube.sigs.k8s.io/), kind, k3s or a managed cluster)
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/) configured for that cluster
- [`helm`](https://helm.sh/docs/intro/install/) v3+

## Install

```bash
# 1. Add the Verdaccio chart repository
helm repo add verdaccio https://charts.verdaccio.org
helm repo update

# 2. Install the chart with the values from this example
helm install my-registry verdaccio/verdaccio -f values.yaml
```

## Access the registry

By default the service is `ClusterIP`. Port-forward it to your machine:

```bash
kubectl port-forward svc/my-registry 4873:4873
```

Then open <http://localhost:4873/> or point npm at it:

```bash
npm publish --registry http://localhost:4873
```

To expose it permanently, set `ingress.enabled: true` in `values.yaml` (an
example block is included and commented out) and re-run `helm upgrade`.

## Upgrade / uninstall

```bash
helm upgrade my-registry verdaccio/verdaccio -f values.yaml
helm uninstall my-registry
```

## Notes

- The `configMap` block in `values.yaml` overrides the chart's default
  configuration. Remove it to fall back to the chart defaults.
- `persistence.enabled: true` provisions a PersistentVolumeClaim so published
  packages survive pod restarts. Make sure your cluster has a default
  StorageClass, or set `persistence.storageClass`.
- For chart options not shown here, see the
  [chart documentation](https://github.com/verdaccio/charts/tree/master/charts/verdaccio).
