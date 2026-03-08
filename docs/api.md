# API Documentation

## Health
- `GET /api/health` -> `{ ok, uptime }`

## Notifications
- `GET /api/notifications` (auth required) -> array of user notifications

## Readings
- `POST /readings/draft` create and pay for a reading draft (form-encoded)
- `GET /readings/:id/poll` poll processing status

## Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
