import { SUPPORTED_LOCALES, ui } from '../config/i18n.js';
import { getDirection } from '../utils/i18n.js';

export function localeMiddleware(req, res, next) {
  const queryLocale = req.query.lang;
  if (queryLocale && SUPPORTED_LOCALES.includes(queryLocale)) {
    res.cookie('locale', queryLocale, { maxAge: 31536000000, httpOnly: false, sameSite: 'lax' });
  }
  const locale = queryLocale || req.cookies.locale || 'ar';
  const safeLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'ar';

  res.locals.locale = safeLocale;
  res.locals.dir = getDirection(safeLocale);
  res.locals.t = ui[safeLocale];
  res.locals.user = req.session.user || null;
  next();
}
