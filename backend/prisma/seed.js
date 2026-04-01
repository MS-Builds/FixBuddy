import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Seed Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@FixBuddy.com' },
    update: {},
    create: {
      email: 'admin@FixBuddy.com',
      password: adminPassword,
    },
  });
  console.log('Admin seeded: admin@FixBuddy.com / admin123');

  // 2. Seed User
  const user = await prisma.user.upsert({
    where: { phoneNumber: '+1234567890' },
    update: {},
    create: {
      name: 'Alice Johnson',
      phoneNumber: '+1234567890',
      email: 'alice@example.com',
      location: 'New York, NY',
    },
  });
  console.log('User seeded:', user.name);

  // 3. Seed Captain
  const captain = await prisma.captain.upsert({
    where: { phoneNumber: '+0987654321' },
    update: {},
    create: {
      name: 'Bob The Builder',
      phoneNumber: '+0987654321',
      email: 'bob@example.com',
      skills: ['Carpenter', 'Handyman'],
      hourlyRate: 50,
      description: 'Expert carpenter ready to fix anything.',
      isVerified: true,
      isActive: true,
    },
  });
  console.log('Captain seeded:', captain.name);

  // 4. Seed Reviews
  const reviewCount = await prisma.review.count({ where: { captainId: captain.id } });
  if (reviewCount === 0) {
    await prisma.review.createMany({
      data: [
        {
          userId: user.id,
          captainId: captain.id,
          rating: 5,
          comment: 'Excellent work, very professional!',
        },
        {
          userId: user.id,
          captainId: captain.id,
          rating: 4,
          comment: 'Good job overall, but arrived a bit late.',
        }
      ]
    });
    console.log('Reviews seeded.');
  } else {
    console.log('Reviews already exist for this captain.');
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
