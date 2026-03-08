import { Router } from 'express';
import { adminController } from '../controllers/admin-controller.js';
import { requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireRole('admin'));

router.get('/', adminController.overview);
router.get('/users', adminController.users);
router.get('/readings', adminController.readings);
router.get('/image-moderation', adminController.section('Image Moderation', 'image-moderation'));
router.get('/payments', adminController.section('Payment Overview', 'payments'));
router.get('/subscriptions', adminController.section('Subscription Management', 'subscriptions'));
router.get('/plans', adminController.section('Plan Management', 'plans'));
router.get('/coupons', adminController.section('Coupon Management', 'coupons'));
router.get('/prompts', adminController.prompts);
router.get('/blog', adminController.section('Blog Management', 'blog'));
router.get('/testimonials', adminController.section('Testimonial Management', 'testimonials'));
router.get('/support', adminController.section('Support Tickets', 'support'));
router.get('/cms', adminController.section('Content Pages / CMS', 'cms'));
router.get('/analytics', adminController.section('Analytics', 'analytics'));
router.get('/audit-logs', adminController.section('Audit Logs', 'audit-logs'));
router.get('/settings', adminController.section('System Settings', 'settings'));

export default router;
