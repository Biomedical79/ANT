# Route Map

## Public
`GET /`, `/how-it-works`, `/pricing`, `/faq`, `/blog`, `/blog/:slug`, `/about`, `/contact`, `/terms`, `/privacy`, `/refund-policy`, `/entertainment-disclaimer`

## Auth
`GET/POST /auth/register`, `GET/POST /auth/login`, `POST /auth/logout`, `GET /auth/forgot-password`, `GET /auth/reset-password/:token`

## Dashboard
`GET /dashboard`, `GET /dashboard/settings`

## Readings
`GET /readings/new`, `POST /readings`, `POST /readings/draft`, `GET /readings/:id/processing`, `GET /readings/:id/poll`, `GET /readings/:id/result`

## Admin
`GET /admin`, `/admin/users`, `/admin/readings`, `/admin/prompts`

## API
`GET /api/health`, `GET /api/notifications`
