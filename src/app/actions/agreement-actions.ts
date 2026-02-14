"use server"

import { auth } from "@/auth"
import { createAgreement, deleteAgreement, getAgreementById, updateAgreement } from "@/services/agreement-service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createAgreementAction(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "OWNER") throw new Error("Unauthorized")

    // Extract Property Data
    // Extract Tenant Data
    // Extract Financials

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
    }

    const agreement = await createAgreement(data)

    revalidatePath("/dashboard/owner/agreements")
    redirect(`/dashboard/owner/agreements/${agreement.id}`)
}

export async function updateAgreementAction(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "OWNER") throw new Error("Unauthorized")

    // For POC, simple updates
    const updates: any = {}

    // Check fields and add to updates
    if (formData.has("monthlyRent")) updates.monthlyRent = Number(formData.get("monthlyRent"))
    // ... add other fields as needed for edit mode

    // Note: The UI for edit mode in this POC might just use client component to call this
    // But implementation details requested MVC. 
    // The existing "Edit" page uses client state. I should refactor it to use actions?
    // "Refactor existing Agreement pages to use Prisma instead of localStorage."

    await updateAgreement(id, updates)
    revalidatePath(`/dashboard/owner/agreements/${id}`)
    revalidatePath("/dashboard/owner/agreements")
}

export async function deleteAgreementAction(id: string) {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "OWNER") throw new Error("Unauthorized")

    await deleteAgreement(id)
    revalidatePath("/dashboard/owner/agreements")
    redirect("/dashboard/owner/agreements")
}
