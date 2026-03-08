# Production Deployment Notes

1. Set strong `SESSION_SECRET`, production DB/Redis URLs, and HTTPS.
2. Run `npx prisma migrate deploy` and `npx prisma db seed`.
3. Use reverse proxy (Nginx/Caddy) with TLS and gzip.
4. Configure object storage adapter for uploaded images (S3-compatible).
5. Add worker queue (BullMQ/Redis) for background reading generation and email jobs.
6. Enable monitoring (health checks, logs, metrics) and periodic backup for PostgreSQL.
