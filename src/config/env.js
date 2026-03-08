import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'SESSION_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  defaultLocale: process.env.DEFAULT_LOCALE || 'ar',
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10),
  billingProvider: process.env.BILLING_PROVIDER || 'mock',
  mailProvider: process.env.MAIL_PROVIDER || 'console'
};
