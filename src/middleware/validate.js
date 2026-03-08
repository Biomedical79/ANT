export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).render('public/error', { message: result.error.issues.map((i) => i.message).join(', ') });
  }
  req.validated = result.data;
  return next();
};
