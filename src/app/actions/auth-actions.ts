"use server"

import { signIn, signOut } from "@/auth"

export async function loginWithGoogle(role: string = "tenant") {
    await signIn("google", { redirectTo: `/dashboard?role=${role}` })
}

export async function loginWithCredentials(formData: FormData) {
    const email = formData.get("email")
    const password = formData.get("password")
    const role = formData.get("role")

    await signIn("credentials", {
        email,
        password,
        role,
        redirectTo: role === "owner" ? "/dashboard/owner" : "/dashboard/tenant",
    })
}

export async function logout() {
    await signOut({ redirectTo: "/" })
}
