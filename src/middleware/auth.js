export function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  return next();
}

export function requireRole(roleName) {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/auth/login');
    if (!req.session.user.roles?.includes(roleName)) return res.status(403).render('public/error', { message: 'Forbidden' });
    return next();
  };
}
