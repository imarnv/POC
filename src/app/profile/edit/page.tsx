import { auth } from "@/auth"
import { fetchProfile, updateProfileFn } from "@/app/actions/profile-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function EditProfilePage() {
    const session = await auth()
    if (!session) redirect("/login")

    const profile = await fetchProfile()

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Link href="/profile" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
            </Link>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
                <p className="text-muted-foreground">Update your personal information</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action={updateProfileFn} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={session.user?.email || ""}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={session.user?.name || ""}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    defaultValue={profile?.phone || ""}
                                    placeholder="+91 98765 43210"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    defaultValue={profile?.address || ""}
                                    placeholder="Enter your complete address"
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="idProofType">ID Proof Type</Label>
                                    <Select name="idProofType" defaultValue={profile?.idProofType || "Aadhaar Card"}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select ID Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                                            <SelectItem value="PAN Card">PAN Card</SelectItem>
                                            <SelectItem value="Passport">Passport</SelectItem>
                                            <SelectItem value="Driving License">Driving License</SelectItem>
                                            <SelectItem value="Voter ID">Voter ID</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="idProofNumber">ID Proof Number</Label>
                                    <Input
                                        id="idProofNumber"
                                        name="idProofNumber"
                                        defaultValue={profile?.idProofNumber || ""}
                                        placeholder="XXXX-XXXX-XXXX"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <Link href="/profile" className="flex-1">
                                <Button variant="outline" className="w-full" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" className="flex-1">
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
