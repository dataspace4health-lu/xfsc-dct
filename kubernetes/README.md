# DCT Kubernets Deployment Guide

## Prerequisites

- Install HashiCorp Vault
- Create Vault access user and certificate
- Add ssl certificate
- Create gitlab access token

## Create namespace
```
kubectl create namespace dct
```

## Add bitnami helm chart
```
helm repo add bitnami https://charts.bitnami.com/bitnami
```
## Deploy Redis Cluster

```
helm install dct bitnami/redis-cluster
```


## DCT Deployment
```
kubectl apply -f dct-deploy.yaml
kubectl apply -f dct-service.yaml
kubectl apply -f dct-ingress.yaml
```
## mkdocs deployment
```
kubectl apply -f mkdocs-claim0-pv.yaml
kubectl apply -f mkdocs-claim1-pv.yaml
kubectl apply -f mkdocs-deploy.yaml
kubectl apply -f mkdocs-service.yaml
kubectl apply -f mkdocs-ingress.yaml
```

## DCT High Availability

- more copies of the aplication can be added by running bellow command or change "replicas:" in del-deploy.yaml
```
kubectl scale --replicas=3 deploy/dct -n dct
```
