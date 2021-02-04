# Kubernetes using Helm

## Prerequisites

- Kubernetes cluster running
- Read Verdaccio Helm [readme](https://github.com/kubernetes/charts/blob/master/stable/verdaccio/README.md).

#### Install Helm

```
brew install kubernetes-helm
```

Initialize `helm`.

```
➜ helm init --service-account default
Creating /Users/user/.helm
Creating /Users/user/.helm/repository
Creating /Users/user/.helm/repository/cache
Creating /Users/user/.helm/repository/local
Creating /Users/user/.helm/plugins
Creating /Users/user/.helm/starters
Creating /Users/user/.helm/cache/archive
Creating /Users/user/.helm/repository/repositories.yaml
Adding stable repo with URL: https://kubernetes-charts.storage.googleapis.com
Adding local repo with URL: http://127.0.0.1:8879/charts
$HELM_HOME has been configured at /Users/user/.helm.

Tiller (the Helm server-side component) has been installed into your Kubernetes Cluster.

Please note: by default, Tiller is deployed with an insecure 'allow unauthenticated users' policy.
For more information on securing your installation see: https://docs.helm.sh/using_helm/#securing-your-helm-installation
Happy Helming!
```

Let's update the helm repo

```
➜ helm repo update
Hang tight while we grab the latest from your chart repositories...
...Skip local chart repository
...Successfully got an update from the "stable" chart repository
Update Complete. ⎈ Happy Helming!⎈
```

Let's install verdaccio

```
➜ helm install stable/verdaccio
NAME:   joking-porcupine
LAST DEPLOYED: Tue May  1 17:15:22 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Pod(related)
NAME                                         READY  STATUS             RESTARTS  AGE
joking-porcupine-verdaccio-594ff959b4-rr4nq  0/1    ContainerCreating  0         0s

==> v1/ConfigMap
NAME                        DATA  AGE
joking-porcupine-verdaccio  1     0s

==> v1/PersistentVolumeClaim
NAME                        STATUS  VOLUME                                    CAPACITY  ACCESS MODES  STORAGECLASS  AGE
joking-porcupine-verdaccio  Bound   pvc-78008a6a-4d52-11e8-86f2-080027bd643e  8Gi       RWO           standard      0s

==> v1/Service
NAME                        TYPE       CLUSTER-IP      EXTERNAL-IP  PORT(S)   AGE
joking-porcupine-verdaccio  ClusterIP  10.100.245.159  <none>       4873/TCP  0s

==> v1beta1/Deployment
NAME                        DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
joking-porcupine-verdaccio  1        1        1           0          0s

NOTES:
1. Get the application URL by running these commands:
  export POD_NAME=$(kubectl get pods --namespace default -l "app=verdaccio,release=vested-lobster" -o jsonpath="{.items[0].metadata.name}")
  kubectl port-forward $POD_NAME 8080:4873
  echo "Visit http://127.0.0.1:8080 to use your application"

```

![alt verdaccio](media/kubernetes_dashboard.png 'verdaccio app')

Then, follow the notes.

We export the application

```
export POD_NAME=$(kubectl get pods --namespace default -l "app=verdaccio,release=veering-gorilla" -o jsonpath="{.items[0].metadata.name}")
```

and we expose the port

```
➜ kubectl port-forward $POD_NAME 8080:4873
Forwarding from 127.0.0.1:8080 -> 4873
Forwarding from [::1]:8080 -> 4873
```

Verdaccio is up and running.

```
http://127.0.0.1:8080/#/
```

### Publishing a Package

Let's log in.

```
➜ npm adduser --registry  http://127.0.0.1:8080
Username: user
Password: ***
Email: (this IS public) user@domain.com
Logged in as user on http://127.0.0.1:8080/.
```

and now we can publish

```
➜ npm publish --registry http://127.0.0.1:8080
+ @kubernetes/hellonode-example@1.0.0
```

![alt verdaccio](media/kubernetes_verdaccio.png 'verdaccio app')

### Scale

Check the pod name (if you do not include --name) on install helm, kubernetes generate a random name.

```
➜ kubectl get pods
NAME                                         READY     STATUS    RESTARTS   AGE
veering-gorilla-verdaccio-666d9488bc-n9p27   1/1       Running   0          11m
```

Let's scale

```
➜ kubectl scale deployment veering-gorilla-verdaccio --replicas=3
deployment.extensions "veering-gorilla-verdaccio" scaled
```

![alt verdaccio](media/kubernetes_scale.png 'verdaccio scaled')

## Problems

I had this issue trying to install verdaccio helm, to solve it I just run a command and all works perfectly.

### [Registered user can't login](https://github.com/verdaccio/verdaccio/issues/943)

If you are facing this issue please read the following link https://github.com/verdaccio/verdaccio/issues/943#issuecomment-427670085

### Connection refused

```
➜ helm install stable/verdaccio
Error: Get http://localhost:8080/api/v1/namespaces/kube-system/configmaps?labelSelector=OWNER%!D(MISSING)TILLER: dial tcp 127.0.0.1:8080: connect: connection refused
```

Run the following script to solve it.

```
kubectl -n kube-system patch deployment tiller-deploy -p '{"spec": {"template": {"spec": {"automountServiceAccountToken": true}}}}'
```

#### Tiller pod is missing

```
➜ helm install stable/verdaccio
Error: could not find a ready tiller pod
```

Run this to fix it.

```
helm init --upgrade
```
