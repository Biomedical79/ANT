import { authService } from '../services/auth-service.js';

export const authController = {
  showRegister: (req, res) => res.render('auth/register', { title: 'Register' }),
  showLogin: (req, res) => res.render('auth/login', { title: 'Login' }),
  showForgot: (req, res) => res.render('auth/forgot-password', { title: 'Forgot Password' }),
  showReset: (req, res) => res.render('auth/reset-password', { title: 'Reset Password', token: req.params.token }),
  async register(req, res, next) {
    try {
      const user = await authService.register(req.validated);
      req.session.user = { id: user.id, email: user.email, roles: ['user'], fullName: user.profile?.fullName };
      res.redirect('/dashboard');
    } catch (err) {
      next(err);
    }
  },
  async login(req, res, next) {
    try {
      req.session.user = await authService.login(req.validated);
      res.redirect('/dashboard');
    } catch (err) {
      next(err);
    }
  },
  logout(req, res) {
    req.session.destroy(() => {
      res.clearCookie('sid');
      res.redirect('/');
    });
  }
};
