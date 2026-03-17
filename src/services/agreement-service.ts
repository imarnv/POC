import { prisma } from "@/lib/prisma"
import { RentalAgreement, Prisma } from "@prisma/client"
import { calculateStatus, AgreementStatus } from "@/utils/agreement-utils"

export type { AgreementStatus }

export async function getOwnerAgreements(userId: string) {
    // Verify user is owner via property ownership (mocked/implied for now as property.ownerId)
    // We will fetch properties owned by user, then agreements linked to those properties
    // Or just all agreements where property.ownerId = userId

    const agreements = await (prisma.rentalAgreement as any).findMany({
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
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.email) return []

    const agreements = await (prisma.rentalAgreement as any).findMany({
        where: {
            OR: [
                { tenantId: userId },
                { tenantEmail: user.email }
            ]
        },
        include: {
            property: {
                include: {
                    owner: true
                }
            }
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

export async function getAgreementById(id: string): Promise<any> {
    const agreement = await (prisma.rentalAgreement as any).findUnique({
        where: { id },
        include: {
            property: true,
            clauses: true
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
    clauses?: any[]
}) {
    // 1. Create Property
    // 2. Create Agreement
    // Check if tenant user exists by email to link?

    const tenantUser = await prisma.user.findUnique({
        where: { email: data.tenantEmail }
    })

    return await prisma.$transaction(async (tx: any) => {
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

        const agreement = await (tx.rentalAgreement as any).create({
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
                status: calculateStatus(data.startDate, data.endDate),
                clauses: {
                    create: data.clauses?.map(clause => ({
                        clauseId: clause.id,
                        title: clause.title,
                        brief: clause.brief,
                        content: clause.content,
                        category: clause.category,
                        isFree: clause.isFree,
                        price: clause.price,
                        createdBy: data.ownerId
                    })) || []
                }
            }
        })

        return agreement
    })
}

export async function updateAgreement(id: string, data: any) {
    return await prisma.$transaction(async (tx) => {
        const { clauses, ...agreementData } = data

        if (clauses) {
            // Delete existing clauses
            await (tx as any).agreementClause.deleteMany({
                where: { agreementId: id }
            })

            // Create new ones
            if (clauses.length > 0) {
                await (tx as any).agreementClause.createMany({
                    data: clauses.map((c: any) => ({
                        agreementId: id,
                        clauseId: c.clauseId || c.id,
                        title: c.title,
                        brief: c.brief,
                        content: c.content,
                        category: c.category,
                        isFree: c.isFree,
                        price: c.price
                    }))
                })
            }
        }

        return await (tx.rentalAgreement as any).update({
            where: { id },
            data: agreementData
        })
    })
}

export async function requestESign(id: string) {
    return await (prisma.rentalAgreement as any).update({
        where: { id },
        data: { status: "SIGNED" }
    })
}

export async function deleteAgreement(id: string) {
    return await (prisma.rentalAgreement as any).delete({
        where: { id }
    })
}

export async function getClauses() {
    return await (prisma as any).clause.findMany({
        orderBy: {
            category: 'asc'
        }
    })
}
