import { prisma } from '../config/prisma.js';

export const apiController = {
  async notifications(req, res) {
    const items = await prisma.notification.findMany({ where: { userId: req.session.user.id }, orderBy: { createdAt: 'desc' }, take: 10 });
    res.json(items);
  },
  health(req, res) {
    res.json({ ok: true, uptime: process.uptime() });
  }
};
