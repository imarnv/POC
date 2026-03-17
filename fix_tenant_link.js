
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Create correct tenant user if not exists
    const correctEmail = 'tenant@example.com';
    let tenantUser = await prisma.user.findUnique({
        where: { email: correctEmail }
    });

    if (!tenantUser) {
        tenantUser = await prisma.user.create({
            data: {
                email: correctEmail,
                name: 'Tenant User',
                role: 'TENANT'
            }
        });
        console.log('Created correct Tenant User:', tenantUser);
    } else {
        console.log('Tenant Tenant User exists:', tenantUser);
    }

    // 2. Find the agreement created for "John Doe" (or any agreement with null tenantId)
    const agreement = await prisma.rentalAgreement.findFirst({
        where: {
            tenantId: null
        }
    });

    if (agreement) {
        // 3. Update the agreement to link to the tenant user
        const updatedAgreement = await prisma.rentalAgreement.update({
            where: { id: agreement.id },
            data: {
                tenantId: tenantUser.id,
                tenantEmail: correctEmail // Optional: sync email if needed for display
            }
        });
        console.log('Linked Agreement to Tenant:', updatedAgreement);
    } else {
        console.log('No unlinked agreement found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
