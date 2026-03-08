import { Router } from 'express';
import { authController } from '../controllers/auth-controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../validators/auth-validator.js';

const router = Router();

router.get('/register', authController.showRegister);
router.post('/register', validate(registerSchema), authController.register);
router.get('/login', authController.showLogin);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/forgot-password', authController.showForgot);
router.get('/reset-password/:token', authController.showReset);

export default router;
