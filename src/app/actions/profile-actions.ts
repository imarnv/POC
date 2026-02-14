"use server"

import { auth } from "@/auth"
import { getUserProfile, updateUserProfile } from "@/services/profile-service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function fetchProfile() {
    const session = await auth()
    if (!session?.user?.id) return null
    return await getUserProfile(session.user.id)
}

export async function updateProfileFn(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const idProofType = formData.get("idProofType") as string
    const idProofNumber = formData.get("idProofNumber") as string

    await updateUserProfile(session.user.id, {
        name,
        phone,
        address,
        idProofType,
        idProofNumber
    })

    revalidatePath("/profile")
    redirect("/profile")
}
