# INTEX Winter 2025 App — Gap Analysis & Implementation Plan

---

## 🕵️‍♂️ Gap Analysis: What Is Missing

### 1. **Backend / API**

- **Security & Auth**
  - No custom password rules (default ASP.NET Identity only)
  - No multi-factor authentication (MFA)
  - No HTTPS enforcement or HTTP→HTTPS redirect
  - No Content Security Policy (CSP) headers or HSTS
  - No API-level RBAC on Movie CRUD endpoints (anyone can modify data)
  - No confirmation prompts for deletions (should be handled frontend, but backend should restrict deletes to admins)
  - No 3rd-party login integration in backend (frontend has Google button)

- **Movie Management**
  - No pagination on movie list API
  - No filtering or search support in API
  - No server-side validation or sanitization
  - No related movies or recommendations included in movie detail API (only separate endpoint)

- **Machine Learning**
  - Only static, precomputed recommendations (from SQLite DBs)
  - No personalized home screen recommendations based on user history/preferences
  - No integration with Azure ML Studio or dynamic Python ML service
  - No user-specific recommendation API

- **Database**
  - Still using SQLite files (`Identity.sqlite`, `Movies.db`, recommendation DBs)
  - Not fully migrated to a server-hosted DB (Azure SQL, MySQL, PostgreSQL)
  - Identity and movie data should be in a real DBMS

---

### 2. **Frontend**

- **Movie Browsing**
  - Infinite scroll, search, filter: **implemented**

- **Movie Detail Page**
  - Related movies: **implemented**
  - Rating submission: **not implemented**
  - Review submission: **missing**

- **User Experience**
  - Logged-in indicator: **implemented**
  - Role-based UI (admin features hidden for customers): **implemented**
  - Admin UI confirmations before delete: **likely missing**

- **Security & Privacy**
  - Cookie consent banner: **implemented**
  - Privacy policy: **implemented and GDPR-compliant**

- **Media Assets**
  - No explicit fallback/default image logic if poster missing
  - No info if poster images from shared drive are integrated

---

### 3. **Deployment & Infrastructure**

- No evidence of deployment to Azure or AWS
- No HTTPS/TLS certificate setup
- No secrets management (env vars, secrets manager)

---

## 🗺️ High-Level Implementation Plan

```mermaid
flowchart TD
    subgraph Security
        A1[Custom Password Rules]
        A2[Enforce HTTPS + Redirect]
        A3[Add CSP & HSTS Headers]
        A4[Role-based API Authorization]
        A5[Multi-factor Auth (Bonus)]
        A6[3rd-party Login Backend]
    end

    subgraph Backend
        B1[Add Pagination, Filter, Search to Movies API]
        B2[Restrict Movie CRUD to Admins]
        B3[Add Confirmations for Deletes]
        B4[Implement Rating & Review Endpoints]
        B5[User-specific Recommendations API]
        B6[Integrate Azure ML or Python Service]
        B7[Migrate to Server-hosted DB]
    end

    subgraph Frontend
        C1[Enable Rating Submission UI]
        C2[Add Review Submission UI]
        C3[Admin Delete Confirmations]
        C4[Default Poster Image Logic]
        C5[Display Personalized Home Recommendations]
    end

    subgraph Deployment
        D1[Deploy Backend to Azure/AWS]
        D2[Setup TLS Certificates]
        D3[Use Env Vars / Secrets Manager]
    end

    Security --> Backend
    Backend --> Frontend
    Backend --> Deployment
```

---

## 📝 Summary Checklist

| **Category**            | **Missing / To Improve**                                                                                     |
|-------------------------|--------------------------------------------------------------------------------------------------------------|
| **Security**            | Custom password rules, HTTPS redirect, CSP/HSTS, API RBAC, MFA, 3rd-party login backend                     |
| **Backend API**         | Pagination, filtering, search, restrict Movie CRUD, confirmations, rating/review endpoints, personalized recs|
| **Machine Learning**    | Home screen personalized recs, dynamic ML integration, Azure ML Studio                                      |
| **Database**            | Migrate from SQLite to Azure SQL/MySQL/Postgres                                                             |
| **Frontend**            | Rating submission, review submission, admin confirmations, default poster fallback                          |
| **Deployment**          | Cloud deployment, TLS certs, secrets management                                                             |

---

## Next Steps

- **Switch to code mode** to begin implementing these improvements.
- **Prioritize security and database migration first.**
- **Then enhance backend API features.**
- **Finally, update frontend and deploy.**