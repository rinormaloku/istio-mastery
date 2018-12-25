commands

```bash
# Create namespace
kubectl create ns istio-system

# Create secrets for grafana and kiali
kubectl apply -f ./resource-manifests/istio/secrets

```

Switch to istio installation dir.

```bash

helm template install/kubernetes/helm/istio --name istio --set global.mtls.enabled=false --set tracing.enabled=true --set kiali.enabled=true --set grafana.enabled=true --set --namespace istio-system > istio.yaml

kubectl apply -f istio.yaml

kubectl label namespace default istio-injection=enabled

kubectl apply -f ./resource-manifests/kube
```

now we need to apply the Gateway

```bash

kubectl apply -f ./resource-manifests/istio/http-gateway.yaml

# Get the ip of the ingress controller
kubectl get svc --all-namespaces -l  app=istio-ingressgateway -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'

```

Install the virtual services so that calls comming in are redirected

```bash

kubectl apply -f ./resource-manifests/istio/sa-virtualservice-external.yaml

# Get the ip of the ingress controller
kubectl get svc --all-namespaces -l  app=istio-ingressgateway -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}'

```

Open the page!

What we get out of the box:

```
kubectl port-forward $(kubectl get pod -n istio-system -l app=kiali -o jsonpath='{.items[0].metadata.name}') -n istio-system 20001

kubectl port-forward -n istio-system $(kubectl get pod -n istio-system -l app=jaeger -o jsonpath='{.items[0].metadata.name}') 16686:16686

kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000
```



