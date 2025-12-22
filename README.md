# CareerPivot MVP 🚀

Plateforme SaaS de stratégie de transition de carrière personnalisée, boostée par l'IA et l'expertise humaine.

## 🛠 Tech Stack

```mermaid
mindmap
  root((CareerPivot))
    Backend
      Java 17
      Spring Boot 3
      Spring Security & JWT
      JPA & Hibernate
      PostgreSQL
    Frontend
      Next.js 16
      React 19
      Lucide Icons
      Tailwind CSS
    Monetization
      Stripe API
      Webhooks
    Infrastructure
      Docker Compose
      Redis
      Postman
```

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)

## ✨ Fonctionnalités (MVP + Phase 3)

1.  **Authentification**: Inscription et Connexion sécurisées (JWT).
2.  **Assessment**: Questionnaire de profilage stocké en JSONB.
3.  **IA Strategy**: Scénarios de transition (Pivot Adjacent vs Total) automatisés.
4.  **Roadmap Dynamique**: Plan d'action détaillé avec suivi des tâches.
5.  **Monétisation (Premium)**: Checkout Stripe et Feature Gating (Plans PRO/PREMIUM).
6.  **Accompagnement Expert**: Module de Coaching humain et retours sur Roadmap.
7.  **Backoffice Admin**: Métriques de performance et gestion des coachs.

## 🚀 Installation & Démarrage

### 1. Infrastructure
```bash
docker-compose up -d postgres redis
```

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
- API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
- App: `http://localhost:3000`

## 🏗 Architecture
Le projet suit une architecture **Modulaire** permettant une séparation claire entre les modules `auth`, `billing`, `coaching`, et `roadmap`.

---
*Généré par Antigravity - Advanced Agentic Coding for CareerPivot.*
