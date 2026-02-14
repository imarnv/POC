import { auth } from "@/auth"
import { getOwnerAgreements } from "@/services/agreement-service"
import Link from "next/link"
import { redirect } from "next/navigation"
import { FileText, Plus, Calendar, User, IndianRupee, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function AgreementsPage() {
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // Fetch agreements from DB
    const agreements = await getOwnerAgreements(session.user.id)

    // Calculate stats
    const activeCount = agreements.filter(a => a.status === "ACTIVE").length
    const expiringCount = agreements.filter(a => a.status === "EXPIRING_SOON").length
    const totalRent = agreements
        .filter(a => a.status === "ACTIVE" || a.status === "EXPIRING_SOON")
        .reduce((sum, a) => sum + a.monthlyRent, 0)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Rental Agreements</h2>
                    <p className="text-muted-foreground">Manage all your rental agreements in one place.</p>
                </div>
                <Link href="/dashboard/owner/agreements/new">
                    <Button size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        New Agreement
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCount}</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expiringCount}</div>
                        <p className="text-xs text-muted-foreground">Within 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Per month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Agreements List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">All Agreements</h3>

                {agreements.map((agreement) => (
                    <Card key={agreement.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3 flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-lg font-semibold">{agreement.tenantName}</h4>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        agreement.status === "ACTIVE"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : agreement.status === "EXPIRING_SOON"
                                                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                                                : "bg-gray-50 text-gray-700 border-gray-200"
                                                    }
                                                >
                                                    {agreement.status === "ACTIVE" && "Active"}
                                                    {agreement.status === "EXPIRING_SOON" && "Expiring Soon"}
                                                    {agreement.status === "EXPIRED" && "Expired"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {/* Combine address parts */}
                                                {[agreement.property.doorNo, agreement.property.street, agreement.property.area, agreement.property.city].filter(Boolean).join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Monthly Rent</p>
                                            <p className="text-sm font-semibold">₹{agreement.monthlyRent.toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Security Deposit</p>
                                            <p className="text-sm font-semibold">₹{agreement.securityDeposit.toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Start Date</p>
                                            <p className="text-sm font-semibold">
                                                {agreement.startDate.toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">End Date</p>
                                            <p className="text-sm font-semibold">
                                                {agreement.endDate.toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Link href={`/dashboard/owner/agreements/${agreement.id}`}>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {agreements.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No agreements yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Create your first rental agreement to get started.
                        </p>
                        <Link href="/dashboard/owner/agreements/new">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Agreement
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
