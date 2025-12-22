# CareerPivot Observability Stack 📊

Cette stack fournit un monitoring (Prometheus/Grafana) et une centralisation des logs (ELK) de bout en bout.

## 🚀 Démarrage Rapide (Local)

Pour lancer la stack localement avec Docker Desktop :

1. Assurez-vous que le réseau `careerpivot-network` existe.
2. Lancez les services :
```bash
docker-compose -f docker-compose.observability.yml up -d
```

### URLs Locales
- **Grafana** : [http://localhost:3001](http://localhost:3001) (admin/admin)
- **Prometheus** : [http://localhost:9090](http://localhost:9090)
- **Kibana** : [http://localhost:5601](http://localhost:5601)

## ☸️ Déploiement Kubernetes (Helm)

### 1. Prometheus & Grafana
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace observability --create-namespace \
  -f values/kube-prometheus-stack-dev.yaml
```

### 2. Elasticsearch & Kibana
```bash
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch -f values/elastic-dev.yaml -n observability
helm install kibana elastic/kibana -f values/kibana-dev.yaml -n observability
```

### 3. Fluent Bit (Log Shipping)
```bash
helm repo add fluent https://fluent.github.io/helm-charts
helm install fluent-bit fluent/fluent-bit -f fluent-bit/values.yaml -n observability
```

## 🔍 Instrumentation Backend

Le backend CareerPivot est configuré pour :
1. **Metrics** : Expose `/actuator/prometheus`.
2. **Logs** : Génère du JSON structuré avec `traceId` et `spanId` via Logback (en profil prod/staging).

## 🚨 Alertes
Les alertes critiques sont définies dans `values/alerting-rules.yaml` :
- Taux d'erreur HTTP > 5%
- Latence P95 > 1s
- Restarts de Pods fréquents

---
*Généré par Antigravity - Observability Ops.*
