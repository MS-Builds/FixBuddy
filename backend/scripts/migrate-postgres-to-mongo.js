import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const { Client } = pg;
const prisma = new PrismaClient();

const sourceUrl = process.env.SOURCE_DATABASE_URL || process.env.POSTGRES_DATABASE_URL || process.env.OLD_DATABASE_URL;
const shouldReset = process.argv.includes('--force-reset');

if (!sourceUrl) {
  console.error('Missing source Postgres URL. Set SOURCE_DATABASE_URL in backend/.env before running this script.');
  process.exit(1);
}

const postgres = new Client({
  connectionString: sourceUrl,
});

const selectAll = async (tableName) => {
  const result = await postgres.query(`SELECT * FROM "${tableName}"`);
  return result.rows;
};

const ensureTargetIsReady = async () => {
  if (!shouldReset) {
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.captain.count(),
      prisma.serviceRequest.count(),
      prisma.message.count(),
      prisma.review.count(),
      prisma.admin.count(),
    ]);

    if (counts.some((count) => count > 0)) {
      throw new Error(
        'Target Mongo database already contains data. Re-run with --force-reset to clear target collections first.'
      );
    }

    return;
  }

  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.user.deleteMany();
  await prisma.captain.deleteMany();
  await prisma.admin.deleteMany();
};

const main = async () => {
  console.log('Connecting to source Postgres...');
  await postgres.connect();

  console.log('Checking target Mongo database...');
  await ensureTargetIsReady();

  console.log('Loading source records...');
  const [users, captains, admins, serviceRequests, messages, reviews] = await Promise.all([
    selectAll('User'),
    selectAll('Captain'),
    selectAll('Admin'),
    selectAll('ServiceRequest'),
    selectAll('Message'),
    selectAll('Review'),
  ]);

  const userIdMap = new Map();
  const captainIdMap = new Map();
  const adminIdMap = new Map();
  const requestIdMap = new Map();

  console.log(`Migrating ${users.length} users...`);
  for (const user of users) {
    const created = await prisma.user.create({
      data: {
        name: user.name,
        phoneNumber: user.phoneNumber,
        email: user.email,
        location: user.location,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
    userIdMap.set(user.id, created.id);
  }

  console.log(`Migrating ${captains.length} captains...`);
  for (const captain of captains) {
    const created = await prisma.captain.create({
      data: {
        name: captain.name,
        phoneNumber: captain.phoneNumber,
        email: captain.email,
        password: captain.password,
        skills: captain.skills || [],
        hourlyRate: captain.hourlyRate != null ? Number(captain.hourlyRate) : null,
        description: captain.description,
        profileImage: captain.profileImage,
        workImages: captain.workImages || [],
        isVerified: captain.isVerified,
        isActive: captain.isActive,
        latitude: captain.latitude != null ? Number(captain.latitude) : null,
        longitude: captain.longitude != null ? Number(captain.longitude) : null,
        totalEarnings: captain.totalEarnings != null ? Number(captain.totalEarnings) : 0,
        createdAt: captain.createdAt,
      },
    });
    captainIdMap.set(captain.id, created.id);
  }

  console.log(`Migrating ${admins.length} admins...`);
  for (const admin of admins) {
    const created = await prisma.admin.create({
      data: {
        email: admin.email,
        password: admin.password,
      },
    });
    adminIdMap.set(admin.id, created.id);
  }

  console.log(`Migrating ${serviceRequests.length} service requests...`);
  for (const request of serviceRequests) {
    const created = await prisma.serviceRequest.create({
      data: {
        userId: userIdMap.get(request.userId),
        captainId: request.captainId ? captainIdMap.get(request.captainId) : null,
        title: request.title,
        serviceType: request.serviceType,
        description: request.description,
        images: request.images || [],
        amount: request.amount != null ? Number(request.amount) : 0,
        status: request.status,
        location: request.location,
        startedAt: request.startedAt,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
    });
    requestIdMap.set(request.id, created.id);
  }

  console.log(`Migrating ${messages.length} messages...`);
  for (const message of messages) {
    await prisma.message.create({
      data: {
        senderId:
          userIdMap.get(message.senderId) ||
          captainIdMap.get(message.senderId) ||
          adminIdMap.get(message.senderId) ||
          message.senderId,
        receiverId:
          userIdMap.get(message.receiverId) ||
          captainIdMap.get(message.receiverId) ||
          adminIdMap.get(message.receiverId) ||
          message.receiverId,
        text: message.text,
        serviceRequestId: requestIdMap.get(message.serviceRequestId),
        createdAt: message.createdAt,
      },
    });
  }

  console.log(`Migrating ${reviews.length} reviews...`);
  for (const review of reviews) {
    await prisma.review.create({
      data: {
        userId: userIdMap.get(review.userId),
        captainId: captainIdMap.get(review.captainId),
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      },
    });
  }

  console.log('Data migration complete.');
};

main()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await postgres.end().catch(() => {});
    await prisma.$disconnect();
  });
