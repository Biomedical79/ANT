import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import csurf from 'csurf';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import publicRoutes from './routes/public-routes.js';
import authRoutes from './routes/auth-routes.js';
import dashboardRoutes from './routes/dashboard-routes.js';
import readingRoutes from './routes/reading-routes.js';
import adminRoutes from './routes/admin-routes.js';
import apiRoutes from './routes/api-routes.js';
import { localeMiddleware } from './middleware/locale.js';
import { secureHeaders, globalRateLimit } from './middleware/security.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const redis = new Redis(env.redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1, retryStrategy: () => null });
redis.on('error', () => {});
redis.connect().catch(() => console.warn('Redis unavailable, using memory session fallback'));


const sessionConfig = {
  name: 'sid',
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', maxAge: 7 * 86400000 }
};
if (redis.status === 'ready') sessionConfig.store = new RedisStore({ client: redis });

app.use(secureHeaders);
app.use(globalRateLimit);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(localeMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.resolve('uploads')));
app.use(csurf({ cookie: true }));
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/readings', readingRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

app.get('/robots.txt', (req, res) => res.type('text/plain').send('User-agent: *\nAllow: /'));
app.get('/sitemap.xml', (req, res) => {
  const urls = ['/', '/pricing', '/faq', '/blog', '/how-it-works'];
  res.type('application/xml').send(`<?xml version="1.0"?><urlset>${urls.map((u) => `<url><loc>${env.appUrl}${u}</loc></url>`).join('')}</urlset>`);
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
