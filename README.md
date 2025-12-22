# CareerPivot MVP

Plateforme SaaS de stratégie de transition de carrière personnalisée.

## Fonctionnalités (MVP)
1.  **Authentification**: Inscription et Connexion sécurisées (JWT).
2.  **Assessment**: Questionnaire de profilage (Compétences, Objectifs, Contraintes) stocké en JSONB.
3.  **Stratégie**: Génération automatique d'un Scénario de transition (Pivot Adjacent vs Reconversion Totale) basé sur les règles métier.
4.  **Roadmap**: Génération d'un plan d'action sur 6 mois avec tâches hebdomadaires.
5.  **Dashboard**: Visualisation du scénario et suivi des tâches.

## Stack Technique
- **Backend**: Java 17, Spring Boot 3, Spring Security, JPA, PostgreSQL (JSONB).
- **Frontend**: Next.js 14, TypeScript, TailwindCSS, React Query (via simple axios hooks).
- **Infra**: Docker Compose (PostgreSQL, Redis).

## Prérequis
- Java 17+
- Node.js 18+
- Docker & Docker Compose
- Maven

## Installation & Démarrage

### 1. Infrastructure (Base de données)
```bash
docker-compose up -d postgres redis
```

### 2. Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
L'API sera accessible sur `http://localhost:8080`.
Documentation Swagger: `http://localhost:8080/swagger-ui.html`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
L'application sera accessible sur `http://localhost:3000`.

## Architecture
- **Backend**: Monolithe Modulaire (`auth`, `assessment`, `scenario`, `roadmap`).
- **Frontend**: Application Next.js (App Router).

## Validation du MVP
1.  Accédez à `http://localhost:3000`.
2.  Créez un compte.
3.  Remplissez le questionnaire (indiquez < 5h/semaine pour un pivot soft, > 5h pour un pivot total).
4.  Consultez votre Dashboard avec le scénario généré et la roadmap.
