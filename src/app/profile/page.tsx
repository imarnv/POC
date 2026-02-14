import { auth } from "@/auth"
import { fetchProfile } from "@/app/actions/profile-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { User, Phone, MapPin, CreditCard, Edit } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const session = await auth()
    if (!session) redirect("/login")

    const profile = await fetchProfile()

    return (
        <div className="container mx-auto py-10 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">Manage your personal information</p>
                </div>
                <Link href="/profile/edit">
                    <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </Link>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Details
                    </CardTitle>
                    <CardDescription>Your basic identification information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p className="font-semibold">{session.user?.name || "Not set"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                            <p className="font-semibold">{session.user?.email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <p className="font-medium">{profile?.phone || "Not set"}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Role</p>
                            <p className="font-medium px-2 py-1 bg-muted rounded-md inline-block text-xs uppercase tracking-wider">
                                {session.user?.role}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Identity & Address
                    </CardTitle>
                    <CardDescription>Information used for agreements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Current Address</p>
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                                <p className="font-medium">{profile?.address || "Not set"}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">ID Proof Type</p>
                                <p className="font-medium">{profile?.idProofType || "Not set"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">ID Proof Number</p>
                                <p className="font-medium font-mono">{profile?.idProofNumber || "Not set"}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
