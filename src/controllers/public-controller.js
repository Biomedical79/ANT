import { prisma } from '../config/prisma.js';
import { safeQuery } from '../utils/safe-query.js';

export const publicController = {
  async home(req, res) {
    const [plans, testimonials, faqs] = await Promise.all([
      safeQuery(() => prisma.plan.findMany({ where: { isActive: true } }), []),
      safeQuery(() => prisma.testimonial.findMany({ where: { isPublic: true }, take: 4 }), []),
      Promise.resolve([
        { q: 'Is this guaranteed prediction?', a: 'No. Symbolic entertainment only.' },
        { q: 'Do you support Arabic?', a: 'Yes, Arabic-first with full RTL.' }
      ])
    ]);
    res.render('public/home', { plans, testimonials, faqs, title: 'AI Coffee Cup Reading' });
  },
  howItWorks: (req, res) => res.render('public/how-it-works', { title: 'How It Works' }),
  pricing: async (req, res) => res.render('public/pricing', { title: 'Pricing', plans: await safeQuery(() => prisma.plan.findMany({ where: { isActive: true } }), []) }),
  faq: (req, res) => res.render('public/faq', { title: 'FAQ' }),
  about: (req, res) => res.render('public/about', { title: 'About' }),
  contact: (req, res) => res.render('public/contact', { title: 'Contact' }),
  terms: (req, res) => res.render('legal/terms', { title: 'Terms' }),
  privacy: (req, res) => res.render('legal/privacy', { title: 'Privacy' }),
  refund: (req, res) => res.render('legal/refund', { title: 'Refund' }),
  disclaimer: (req, res) => res.render('legal/disclaimer', { title: 'Entertainment Disclaimer' }),
  async blog(req, res) {
    const posts = await safeQuery(() => prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' } }), []);
    res.render('blog/index', { title: 'Blog', posts });
  },
  async blogPost(req, res) {
    const post = await safeQuery(() => prisma.blogPost.findUnique({ where: { slug: req.params.slug } }), null);
    if (!post || !post.isPublished) return res.status(404).render('public/error', { message: 'Post not found' });
    res.render('blog/post', { title: post.title, post });
  }
};
