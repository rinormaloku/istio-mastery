Commands to quickly set up the cluster with the application.

0.  Create 'istio-system' namespace

```bash
kubectl create ns istio-system
```

1. Switch to istio installation dir and install istio into the cluster.

```bash

helm template install/kubernetes/helm/istio \
  --set global.mtls.enabled=false \
  --set tracing.enabled=true \
  --set kiali.enabled=true \
  --set grafana.enabled=true \
  --namespace istio-system > istio.yaml

kubectl apply -f istio.yaml

# Wait until pods are in Running or Completed state
kubectl get pods -n istio-system

```

2. Label the **default** namespace for auto sidecar injection

```bash

kubectl label namespace default istio-injection=enabled

```

3. Set up the application:

```bash

kubectl apply -f ./resource-manifests/kube

```

4. Set up the Gateway for ingress HTTP requests

```bash

kubectl apply -f resource-manifests/istio/http-gateway.yaml 

```

5. Install the virtual services so that requests are routed

```bash

kubectl apply -f resource-manifests/istio/sa-virtualservice-external.yaml


```

6. Open the application on the IP returned by:

```bash

kubectl get svc -n istio-system \
  -l app=istio-ingressgateway \
  -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'

```

X. What we get out of the box:

```bash
 # Kiali
kubectl port-forward \
    $(kubectl get pod -n istio-system -l app=kiali \
    -o jsonpath='{.items[0].metadata.name}') \
    -n istio-system 20001


# Grafana
kubectl -n istio-system port-forward \
    $(kubectl -n istio-system get pod -l app=grafana \
    -o jsonpath='{.items[0].metadata.name}') 3000


# Jaeger 
kubectl port-forward -n istio-system \
    $(kubectl get pod -n istio-system -l app=jaeger \
    -o jsonpath='{.items[0].metadata.name}') 16686
```