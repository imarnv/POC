import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LandingContent } from "@/components/landing/landing-content"

export default async function LandingPage() {
  const session = await auth()

  if (session?.user) {
    const role = session.user.role?.toLowerCase()
    if (role === "owner") {
      redirect("/dashboard/owner")
    } else {
      redirect("/dashboard/tenant")
    }
  }

  return <LandingContent />
}
