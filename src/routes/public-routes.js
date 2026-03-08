import { Router } from 'express';
import { publicController } from '../controllers/public-controller.js';

const router = Router();

router.get('/', publicController.home);
router.get('/how-it-works', publicController.howItWorks);
router.get('/pricing', publicController.pricing);
router.get('/faq', publicController.faq);
router.get('/about', publicController.about);
router.get('/contact', publicController.contact);
router.get('/blog', publicController.blog);
router.get('/blog/:slug', publicController.blogPost);
router.get('/terms', publicController.terms);
router.get('/privacy', publicController.privacy);
router.get('/refund-policy', publicController.refund);
router.get('/entertainment-disclaimer', publicController.disclaimer);

export default router;
