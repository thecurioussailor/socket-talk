#!/bin/bash

# Apply all Kubernetes manifests in order
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-storage/
kubectl apply -f 02-secrets/
kubectl apply -f 03-databases/
kubectl apply -f 04-backend/
kubectl apply -f 05-frontend/
kubectl apply -f 06-networking/

echo "Deployment completed!"