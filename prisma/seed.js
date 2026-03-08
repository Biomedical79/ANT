import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({ where: { key: 'admin' }, update: {}, create: { key: 'admin', label: 'Administrator' } });
  const userRole = await prisma.role.upsert({ where: { key: 'user' }, update: {}, create: { key: 'user', label: 'User' } });

  await prisma.permission.createMany({
    data: [
      { key: 'manage_users', label: 'Manage users' },
      { key: 'manage_prompts', label: 'Manage prompts' },
      { key: 'manage_payments', label: 'Manage payments' }
    ],
    skipDuplicates: true
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@finjanplus.com' },
    update: {},
    create: {
      email: 'admin@finjanplus.com',
      passwordHash: await bcrypt.hash('Admin123!@#', 12),
      status: 'ACTIVE',
      emailVerifiedAt: new Date(),
      preferredLanguage: 'ar',
      profile: { create: { fullName: 'System Admin' } }
    }
  });

  await prisma.userRole.upsert({ where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } }, update: {}, create: { userId: admin.id, roleId: adminRole.id } });

  await prisma.plan.createMany({
    data: [
      { key: 'single', name: 'Single Reading', priceCents: 1900, currency: 'USD', interval: 'once', features: ['1 reading', 'PDF export'] },
      { key: 'premium_monthly', name: 'Premium Monthly', priceCents: 2900, currency: 'USD', interval: 'month', features: ['5 readings/month', 'Priority queue', 'Audio narration'] }
    ],
    skipDuplicates: true
  });

  await prisma.promptTemplate.createMany({
    data: [
      {
        key: 'default_ar_gentle',
        language: 'ar',
        tone: 'gentle',
        templateBody: 'أنت مساعد متخصص في القراءة الرمزية لفنجان القهوة لأغراض الترفيه.',
        sectionOrder: ['summary', 'arabic_style_reading', 'hidden_influences', 'timing', 'final_message'],
        disclaimer: 'هذه القراءة رمزية وترفيهية وليست نصيحة مهنية.'
      },
      {
        key: 'default_en_practical',
        language: 'en',
        tone: 'practical',
        templateBody: 'You provide symbolic coffee cup readings for entertainment purposes only.',
        sectionOrder: ['summary', 'oriental_style_reading', 'work', 'money', 'final_message'],
        disclaimer: 'This reading is symbolic entertainment and not factual certainty.'
      }
    ],
    skipDuplicates: true
  });

  await prisma.blogPost.createMany({
    data: [
      {
        slug: 'coffee-symbols-beginners-guide',
        title: 'Coffee Symbol Reading: A Beginner Guide',
        excerpt: 'How symbolic patterns are interpreted in a modern entertainment format.',
        contentHtml: '<p>Discover how modern symbolic readings combine tradition with AI assistance.</p>',
        language: 'en',
        isPublished: true,
        publishedAt: new Date()
      }
    ],
    skipDuplicates: true
  });

  await prisma.testimonial.createMany({
    data: [
      { author: 'Noura A.', quote: 'Elegant and surprisingly thoughtful symbolic insights.', rating: 5, isPublic: true },
      { author: 'Omar K.', quote: 'Loved the bilingual experience and polished report.', rating: 5, isPublic: true }
    ],
    skipDuplicates: true
  });
}

main().finally(async () => prisma.$disconnect());
