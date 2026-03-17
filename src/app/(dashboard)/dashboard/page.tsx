
import { redirect } from "next/navigation"
import { auth } from "@/auth"

interface DashboardRootPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardRootPage({ searchParams }: DashboardRootPageProps) {
    const session = await auth()
    const params = await searchParams

    if (!session?.user) {
        redirect("/")
    }

    // Role priority: 
    // 1. Explicit 'role' query parameter (for Google login flow)
    // 2. Role stored in session/database
    const queryRole = typeof params.role === "string" ? params.role.toLowerCase() : null
    const sessionRole = session.user.role?.toLowerCase()

    const role = queryRole || sessionRole

    if (role === "owner") {
        redirect("/dashboard/owner")
    } else {
        redirect("/dashboard/tenant")
    }
}
