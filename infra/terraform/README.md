# CareerPivot Infrastructure (Terraform) 🌍

Infrastructure-as-Code (IaC) pour la plateforme CareerPivot, basée sur AWS et Kubernetes (EKS).

## 🏗 Structure du projet

- `modules/` : Composants réutilisables (Network, EKS, RDS, S3, etc.).
- `environments/` : Configurations spécifiques par environnement (dev, staging, prod).
- `global/` : Versioning et providers communs.

## 🛠 Prérequis

1.  **AWS CLI** configuré avec les accès appropriés.
2.  **Terraform >= 1.5.0**.
3.  **S3 & DynamoDB** : Un bucket S3 (`careerpivot-terraform-state`) et une table DynamoDB (`careerpivot-terraform-locks`) doivent exister pour le backend distant.

## 🚀 Utilisation (Local)

Pour déployer l'environnement `dev` :

```bash
cd environments/dev
terraform init
terraform plan
terraform apply
```

## 🔒 Sécurité

- Les secrets (mots de passe DB, etc.) sont passés via des variables d'environnement `TF_VAR_db_password` ou via AWS Secrets Manager (recommandé).
- Le backend est chiffré au repos (AES256).
- Le verrouillage d'état (state locking) est assuré par DynamoDB.

## 📡 CI/CD

Le pipeline GitLab (`.gitlab-ci.yml`) automatise :
1.  **Linting** : `tflint` et `checkov` (sécurité).
2.  **Validation** : `terraform validate`.
3.  **Plan** : Généré sur chaque MR.
4.  **Apply** : Manuel sur la branche `main`.

---
*Généré par Antigravity - DevOps Ops for CareerPivot.*
