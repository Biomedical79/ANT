import { userRepository } from '../repositories/user-repository.js';
import { hashPassword, comparePassword } from '../utils/crypto.js';
import { AppError } from '../utils/errors.js';
import { prisma } from '../config/prisma.js';

export const authService = {
  async register({ email, password, fullName, language = 'ar' }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError('Email already in use', 409);

    const role = await prisma.role.findUnique({ where: { key: 'user' } });
    const user = await userRepository.createUser({
      email,
      passwordHash: await hashPassword(password),
      status: 'ACTIVE',
      preferredLanguage: language,
      profile: { create: { fullName } },
      roles: role ? { create: [{ roleId: role.id }] } : undefined
    });
    return user;
  },
  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user?.passwordHash) throw new AppError('Invalid credentials', 401);
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new AppError('Invalid credentials', 401);

    return {
      id: user.id,
      email: user.email,
      fullName: user.profile?.fullName,
      roles: user.roles.map((r) => r.role.key),
      preferredLanguage: user.preferredLanguage
    };
  }
};
