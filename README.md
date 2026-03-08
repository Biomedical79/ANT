# Finjan Plus - AI Coffee Cup Reading Platform

Production-ready, commercially usable HTML-first Express application for symbolic entertainment coffee cup readings.

## Features
- Arabic-first RTL + English LTR localization
- Public marketing website + legal pages + blog
- Authentication, dashboard, and admin panel
- Multi-step reading wizard with uploads
- AI symbolic reading engine with template management
- Monetization models: plans, one-time payments, invoices, coupons
- SEO foundations: metadata, OG tags, robots.txt, sitemap.xml
- Dockerized local deployment

## Setup
```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Folder Structure
- `src/` app source
- `prisma/` schema and seed
- `docs/` architecture/API/deployment/test plan
- `uploads/` local file storage

## Security and Compliance
- Readings are symbolic entertainment only; no guaranteed predictions.
- Uses CSRF protection, session hardening, rate limiting, and secure headers.

## Commercial Readiness
- Plans, subscriptions, invoices, coupon model, referrals, testimonials, and admin controls are included.
