import { prisma } from '../config/prisma.js';

export async function audit(actorUserId, action, entityType, entityId, metadata = {}) {
  await prisma.auditLog.create({ data: { actorUserId, action, entityType, entityId, metadata } });
}
