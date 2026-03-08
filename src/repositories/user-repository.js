import { prisma } from '../config/prisma.js';

export const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } }, profile: true } });
  },
  createUser(data) {
    return prisma.user.create({ data, include: { profile: true } });
  },
  getDashboardSummary(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        readings: { orderBy: { createdAt: 'desc' }, take: 10 },
        subscriptions: { include: { plan: true }, take: 1 },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
        notifications: { orderBy: { createdAt: 'desc' }, take: 8 },
        supportTickets: { orderBy: { updatedAt: 'desc' }, take: 5 },
        profile: true
      }
    });
  }
};
