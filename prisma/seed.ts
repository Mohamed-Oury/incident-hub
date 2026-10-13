import { PrismaClient, Role } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('🌱 Démarrage du seeding Monétique & CBS Hub...');

  // 1. Utilisateur Administrateur Global
  const adminPassword = hashPassword('123456');
  const adminUser = await prisma.user.upsert({
    where: { email: 'ourykohkoun@gmail.com' },
    update: {
      name: 'Oury Kohkoun (Administrateur Global)',
      role: 'ADMIN' as Role,
      passwordHash: adminPassword,
      active: true,
    },
    create: {
      email: 'ourykohkoun@gmail.com',
      name: 'Oury Kohkoun (Administrateur Global)',
      role: 'ADMIN' as Role,
      passwordHash: adminPassword,
      active: true,
    },
  });

  console.log('✅ Utilisateur admin configuré:', adminUser.email);
  console.log('🎉 Seeding Monétique & CBS terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur de seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
