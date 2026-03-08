# Architecture Overview

- HTML-first, server-rendered multi-page app using EJS partials/layout patterns.
- Express modular layers: routes -> controllers -> services -> repositories -> Prisma(PostgreSQL).
- Progressive enhancement via ES6 modules for wizard UX, async polling, and dashboard interactions.
- Security stack: Helmet CSP, rate limiting, CSRF cookies, secure session cookies, ORM SQLi mitigation, upload validation.
- AI reading engine: pattern extraction abstraction + templated bilingual generation + disclaimer enforcement.
- Commercial stack: plans, payments, invoices, coupons, subscriptions, testimonials, referrals, support tickets.
