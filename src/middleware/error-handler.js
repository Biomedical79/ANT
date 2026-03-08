export function notFoundHandler(req, res) {
  res.status(404).render('public/error', { message: 'Page not found' });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).render('public/error', { message: err.message || 'Unexpected error' });
}
