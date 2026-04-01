import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verify() {
    const admin = await prisma.admin.findUnique({
        where: { email: 'admin@FixBuddy.com' }
    });
    if (admin) {
        console.log('Verification Success: Admin exists in database.');
    } else {
        console.log('Verification Failure: Admin NOT found in database.');
    }
}

verify()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
