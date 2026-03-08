import { prisma } from '../config/prisma.js';

export const adminController = {

  section(title, sectionKey) {
    return (req, res) => res.render('admin/section', { title, sectionKey });
  },
  async overview(req, res) {
    const [users, readings, payments] = await Promise.all([
      prisma.user.count(),
      prisma.reading.count(),
      prisma.payment.count({ where: { status: 'SUCCEEDED' } })
    ]);
    res.render('admin/index', { title: 'Admin Dashboard', stats: { users, readings, payments } });
  },
  async users(req, res) {
    const users = await prisma.user.findMany({ include: { profile: true }, take: 50, orderBy: { createdAt: 'desc' } });
    res.render('admin/users', { title: 'User Management', users });
  },
  async prompts(req, res) {
    const prompts = await prisma.promptTemplate.findMany({ orderBy: { updatedAt: 'desc' } });
    res.render('admin/prompts', { title: 'Prompt Templates', prompts });
  },
  async readings(req, res) {
    const readings = await prisma.reading.findMany({ take: 50, orderBy: { createdAt: 'desc' }, include: { user: true } });
    res.render('admin/readings', { title: 'Reading Management', readings });
  }
};
