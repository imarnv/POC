
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const agreements = await prisma.rentalAgreement.findMany();
    const users = await prisma.user.findMany();

    console.log('Agreements:', JSON.stringify(agreements, null, 2));
    console.log('Users:', JSON.stringify(users, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
