import { prisma } from "@/lib/prisma"
import { RentalAgreement, Prisma } from "@prisma/client"
import { calculateStatus, AgreementStatus } from "@/utils/agreement-utils"

export type { AgreementStatus }

export async function getOwnerAgreements(userId: string) {
    // Verify user is owner via property ownership (mocked/implied for now as property.ownerId)
    // We will fetch properties owned by user, then agreements linked to those properties
    // Or just all agreements where property.ownerId = userId

    const agreements = await prisma.rentalAgreement.findMany({
        where: {
            property: {
                ownerId: userId
            }
        },
        include: {
            property: true,
            tenantUser: true // If linked
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    // Calculate dynamic status for display
    return agreements.map((agreement: any) => ({
        ...agreement,
        status: calculateStatus(agreement.startDate, agreement.endDate)
    }))
}

export async function getTenantAgreements(userId: string) {
    // Agreements where tenantId matches (if linked) OR maybe matched by email?
    // For now, by tenantId
    const agreements = await prisma.rentalAgreement.findMany({
        where: {
            tenantId: userId
        },
        include: {
            property: true
        },
        orderBy: {
            updatedAt: 'desc'
        }
    })

    return agreements.map((agreement: any) => ({
        ...agreement,
        status: calculateStatus(agreement.startDate, agreement.endDate)
    }))
}

export async function getAgreementById(id: string) {
    const agreement = await prisma.rentalAgreement.findUnique({
        where: { id },
        include: {
            property: true
        }
    })

    if (!agreement) return null

    return {
        ...agreement,
        status: calculateStatus(agreement.startDate, agreement.endDate)
    }
}

export async function createAgreement(data: {
    ownerId: string
    tenantName: string
    tenantMobile: string
    tenantEmail: string
    fatherName: string

    propertyAddress: string
    doorNo: string
    street: string
    area: string
    city: string
    state: string
    landmark: string

    propertyType: string
    builtUpArea: number
    configuration: string
    orientation: string
    floorNo: number
    totalFloors: number

    monthlyRent: number
    securityDeposit: number
    startDate: Date
    endDate: Date
}) {
    // 1. Create Property
    // 2. Create Agreement
    // Check if tenant user exists by email to link?

    const tenantUser = await prisma.user.findUnique({
        where: { email: data.tenantEmail }
    })

    return await prisma.$transaction(async (tx) => {
        const property = await tx.property.create({
            data: {
                ownerId: data.ownerId,
                address: data.propertyAddress,
                doorNo: data.doorNo,
                street: data.street,
                area: data.area,
                city: data.city,
                state: data.state,
                landmark: data.landmark,
                type: data.propertyType,
                builtUpArea: data.builtUpArea,
                configuration: data.configuration,
                orientation: data.orientation,
                floorNo: data.floorNo,
                totalFloors: data.totalFloors
            }
        })

        const agreement = await tx.rentalAgreement.create({
            data: {
                propertyId: property.id,
                tenantName: data.tenantName,
                tenantMobile: data.tenantMobile,
                tenantEmail: data.tenantEmail,
                fatherName: data.fatherName,
                monthlyRent: data.monthlyRent,
                securityDeposit: data.securityDeposit,
                startDate: data.startDate,
                endDate: data.endDate,
                tenantId: tenantUser?.id, // Link if exists
                status: calculateStatus(data.startDate, data.endDate)
            }
        })

        return agreement
    })
}

export async function updateAgreement(id: string, data: Partial<RentalAgreement>) {
    return await prisma.rentalAgreement.update({
        where: { id },
        data // Be careful with relations
    })
}

export async function deleteAgreement(id: string) {
    return await prisma.rentalAgreement.delete({
        where: { id }
    })
}
