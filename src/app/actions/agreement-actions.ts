"use server"

import { auth } from "@/auth"
import { createAgreement, deleteAgreement, getAgreementById, updateAgreement, getTenantAgreements, getClauses, requestESign } from "@/services/agreement-service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { Agreement } from "@/types/agreement"

export async function createAgreementAction(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "OWNER") {
        throw new Error("Unauthorized")
    }

    const data = {
        ownerId: session.user.id,
        tenantName: formData.get("tenantName") as string,
        tenantMobile: formData.get("tenantMobile") as string,
        tenantEmail: formData.get("tenantEmail") as string,
        fatherName: formData.get("fatherName") as string,

        propertyAddress: formData.get("propertyAddress") as string,
        doorNo: formData.get("doorNo") as string,
        street: formData.get("street") as string,
        area: formData.get("area") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        landmark: formData.get("landmark") as string,

        propertyType: formData.get("propertyType") as string,
        builtUpArea: Number(formData.get("builtUpArea")),
        configuration: formData.get("configuration") as string,
        orientation: formData.get("orientation") as string,
        floorNo: Number(formData.get("floorNo")),
        totalFloors: Number(formData.get("totalFloors")),

        monthlyRent: Number(formData.get("monthlyRent")),
        securityDeposit: Number(formData.get("securityDeposit")),
        startDate: new Date(formData.get("startDate") as string),
        endDate: new Date(formData.get("endDate") as string),
        clauses: formData.get("clauses") ? JSON.parse(formData.get("clauses") as string) : []
    }

    const agreement = await createAgreement(data)

    revalidatePath("/dashboard/owner/agreements")
    redirect(`/dashboard/owner/agreements/${agreement.id}`)
}

export async function getAgreementAction(id: string): Promise<Agreement | null> {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "OWNER") return null

    const agreement = await getAgreementById(id) as any
    if (!agreement) return null

    // Map Prisma object to Agreement interface
    return {
        id: agreement.id,
        tenantName: agreement.tenantName,
        tenantMobile: agreement.tenantMobile,
        tenantEmail: agreement.tenantEmail,
        fatherName: agreement.fatherName,
        propertyAddress: agreement.property.address,
        doorNo: agreement.property.doorNo,
        street: agreement.property.street,
        area: agreement.property.area,
        city: agreement.property.city,
        state: agreement.property.state,
        landmark: agreement.property.landmark,
        propertyType: agreement.property.type,
        builtUpArea: agreement.property.builtUpArea,
        configuration: agreement.property.configuration,
        orientation: agreement.property.orientation,
        floorNo: agreement.property.floorNo,
        totalFloors: agreement.property.totalFloors,
        monthlyRent: agreement.monthlyRent,
        securityDeposit: agreement.securityDeposit,
        startDate: agreement.startDate.toISOString(),
        endDate: agreement.endDate.toISOString(),
        status: agreement.status as "active" | "expiring_soon" | "expired",
        ownerId: agreement.property.ownerId,
        clauses: agreement.clauses?.map((c: any) => ({
            id: c.id,
            clauseId: c.clauseId,
            title: c.title,
            brief: c.brief,
            content: c.content,
            category: c.category,
            isFree: c.isFree,
            price: c.price
        })) || []
    }
}

export async function updateAgreementAction(id: string, data: any) {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "OWNER") throw new Error("Unauthorized")

    // Extract clauses if they exist
    const { clauses, ...agreementFields } = data

    const updates: any = { ...agreementFields }
    if (clauses) {
        updates.clauses = clauses
    }

    await updateAgreement(id, updates)
    revalidatePath(`/dashboard/owner/agreements/${id}`)
    revalidatePath("/dashboard/owner/agreements")
    return true
}

export async function requestESignAction(id: string) {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "OWNER") throw new Error("Unauthorized")

    await requestESign(id)
    revalidatePath(`/dashboard/owner/agreements/${id}`)
    revalidatePath("/dashboard/owner/agreements")
    return true
}


export async function getTenantAgreementsAction(): Promise<Agreement[]> {
    const session = await auth()
    if (!session?.user?.id) return []

    const agreements = await getTenantAgreements(session.user.id)

    // Map Prisma objects to Agreement interface
    return agreements.map((agreement: any) => ({
        id: agreement.id,
        tenantName: agreement.tenantName,
        tenantMobile: agreement.tenantMobile,
        tenantEmail: agreement.tenantEmail,
        fatherName: agreement.fatherName,
        propertyAddress: agreement.property.address,
        doorNo: agreement.property.doorNo,
        street: agreement.property.street,
        area: agreement.property.area,
        city: agreement.property.city,
        state: agreement.property.state,
        landmark: agreement.property.landmark,
        propertyType: agreement.property.type,
        builtUpArea: agreement.property.builtUpArea,
        configuration: agreement.property.configuration,
        orientation: agreement.property.orientation,
        floorNo: agreement.property.floorNo,
        totalFloors: agreement.property.totalFloors,
        monthlyRent: agreement.monthlyRent,
        securityDeposit: agreement.securityDeposit,
        startDate: agreement.startDate.toISOString(),
        endDate: agreement.endDate.toISOString(),
        status: agreement.status as "active" | "expiring_soon" | "expired",
        ownerId: agreement.property.ownerId,
        ownerName: agreement.property.owner?.name // We might need to include owner in service
    }))
}

export async function deleteAgreementAction(id: string) {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "OWNER") throw new Error("Unauthorized")

    await deleteAgreement(id)
    revalidatePath("/dashboard/owner/agreements")
    return true
}

export async function getClausesAction() {
    const session = await auth()
    if (!session?.user?.id) return []
    return await getClauses()
}

