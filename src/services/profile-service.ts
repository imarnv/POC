import { prisma } from "@/lib/prisma"
import { UserProfile, Prisma } from "@prisma/client"

export async function getUserProfile(userId: string) {
    return await prisma.userProfile.findUnique({
        where: { userId },
        include: { user: true }
    })
}

export async function updateUserProfile(userId: string, data: {
    name?: string
    phone?: string
    address?: string
    idProofType?: string
    idProofNumber?: string
}) {
    // Transaction to update both User (name) and UserProfile (details)
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Update User name if provided
        if (data.name) {
            await tx.user.update({
                where: { id: userId },
                data: { name: data.name }
            })
        }

        // Upsert Profile
        const profile = await tx.userProfile.upsert({
            where: { userId },
            create: {
                userId,
                phone: data.phone,
                address: data.address,
                idProofType: data.idProofType,
                idProofNumber: data.idProofNumber
            },
            update: {
                phone: data.phone,
                address: data.address,
                idProofType: data.idProofType,
                idProofNumber: data.idProofNumber
            }
        })

        return profile
    })
}
