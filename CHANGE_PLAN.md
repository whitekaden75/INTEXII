# INTEX Winter 2025 — Step-by-Step Change Plan

---

## 1. **Security Enhancements**

- [ ] **Custom Password Rules**
  - Enforce stronger password policies in ASP.NET Identity (min length, uppercase, lowercase, digit, special char).
- [ ] **Enforce HTTPS**
  - Redirect HTTP to HTTPS in middleware.
  - Configure TLS certificates.
- [ ] **Add Security Headers**
  - Content Security Policy (CSP)
  - HTTP Strict Transport Security (HSTS)
  - X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- [ ] **Role-Based API Authorization**
  - Add `[Authorize(Roles="Administrator")]` to Movie CRUD endpoints.
  - Restrict sensitive endpoints to admins.
- [ ] **Multi-Factor Authentication (Bonus)**
  - Integrate MFA with ASP.NET Identity.
- [ ] **3rd-Party Login Backend**
  - Implement OAuth (Google, Microsoft) in backend to match frontend button.

---

## 2. **Backend API Improvements**

- [ ] **Pagination, Filtering, Search**
  - Add query parameters to `GET /api/movies` for:
    - `page`, `pageSize`
    - `search` (title)
    - `genre`
- [ ] **Restrict Movie CRUD**
  - Enforce admin-only access.
  - Add confirmation prompts in frontend.
- [ ] **Rating & Review Endpoints**
  - Create endpoints to submit and fetch user ratings and reviews.
- [ ] **User-Specific Recommendations**
  - Endpoint to get personalized recommendations for logged-in user.
- [ ] **Integrate ML Service**
  - Connect to Azure ML Studio or Python API for dynamic recommendations.

---

## 3. **Frontend Enhancements**

- [ ] **Rating Submission UI**
  - Enable rating input on movie detail page.
  - Connect to backend rating API.
- [ ] **Review Submission UI**
  - Add review form on movie detail page.
  - Display user reviews.
- [ ] **Admin Delete Confirmations**
  - Add confirmation dialogs before delete actions.
- [ ] **Default Poster Image**
  - Show fallback image if poster missing.
- [ ] **Personalized Home Recommendations**
  - Display user-specific recommendations on home page.


## 6. **Bonus Security Features (Choose at least 1)**

- [ ] Multi-factor authentication
- [ ] Data sanitization/encoding
- [ ] Custom cookie settings
- [ ] Secure transport headers (HSTS)
- [ ] Real DBMS for identity + movie DBs

---

# Prioritization Order

1. **Security fixes (passwords, HTTPS, RBAC)**
2. **Database migration**
3. **Backend API improvements (pagination, filtering, ratings)**
4. **Frontend enhancements (ratings, reviews, confirmations)**
5. **Machine learning integration**
6. **Deployment & secrets management**

---

# Notes

- This plan aligns with the requirements and gap analysis.
- Each step can be tracked and implemented incrementally.
- Adjust prioritization based on team capacity and deadlines.