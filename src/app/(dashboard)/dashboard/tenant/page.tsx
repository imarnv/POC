
import * as React from "react"
import { CalendarClock, Download, Home, IndianRupee, Phone, ShieldCheck, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTenantAgreementsAction } from "@/app/actions/agreement-actions"
import { auth } from "@/auth"
import Link from "next/link"

export default async function TenantDashboard() {
    const session = await auth()
    const agreements = await getTenantAgreementsAction()

    const activeAgreement = agreements.find(a => a.status === "active" || a.status === "expiring_soon") || agreements[0]

    if (!activeAgreement) {
        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Home</h2>
                    <p className="text-muted-foreground">Manage your rental agreement and payments.</p>
                </div>

                <Card className="border-none shadow-lg bg-muted/20 py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <Building2 className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <CardTitle className="text-2xl">No Active Agreements</CardTitle>
                            <CardDescription className="max-w-sm mx-auto text-base">
                                Once your owner creates a rental agreement for your email ({session?.user?.email}), it will appear here.
                            </CardDescription>
                        </div>
                        <Link href="mailto:support@rentalapp.com">
                            <Button variant="outline">Contact Support</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 0
        }).format(amt)
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    // Calculate days until next rent (mocking 5th of next month for now as we don't have rent schedule yet)
    const today = new Date()
    const nextRentDate = new Date(today.getFullYear(), today.getMonth() + (today.getDate() > 5 ? 1 : 0), 5)
    const diffTime = Math.abs(nextRentDate.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">My Home</h2>
                <p className="text-muted-foreground">Manage your rental agreement and payments.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Active Property Card */}
                <Card className="md:col-span-2 lg:col-span-1 border-none shadow-lg bg-gradient-to-br from-white to-slate-50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                                {activeAgreement.doorNo ? `${activeAgreement.doorNo}, ` : ""}{activeAgreement.propertyAddress || "Your Rental Property"}
                            </CardTitle>
                            <Badge className={activeAgreement.status === 'active' ? "bg-green-600" : "bg-orange-600"}>
                                {activeAgreement.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <CardDescription>
                            {activeAgreement.street ? `${activeAgreement.street}, ` : ""}
                            {activeAgreement.area ? `${activeAgreement.area}, ` : ""}
                            {activeAgreement.city || ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Monthly Rent</p>
                                <p className="text-2xl font-bold flex items-center">
                                    <IndianRupee className="w-4 h-4 mr-1 text-primary" /> {formatCurrency(activeAgreement.monthlyRent)}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
                                <p className="text-lg font-medium flex items-center">5th of every month</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Lease Ends</p>
                                <p className="text-lg font-medium">{formatDate(activeAgreement.endDate)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Deposit</p>
                                <p className="text-lg font-medium">₹ {formatCurrency(activeAgreement.securityDeposit)}</p>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">Agreement Verified</p>
                                <p className="text-xs text-blue-700">Digitally signed on {formatDate(activeAgreement.startDate)}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="gap-3">
                        <Button className="w-full">
                            <IndianRupee className="w-4 h-4 mr-2" /> Pay Rent
                        </Button>
                        <Button variant="outline" className="w-full">
                            <Download className="w-4 h-4 mr-2" /> Agreement
                        </Button>
                    </CardFooter>
                </Card>

                {/* Owner Info & Quick Actions */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Landlord Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-lg font-bold">
                                    {(activeAgreement as any).ownerName ? (activeAgreement as any).ownerName.charAt(0).toUpperCase() : "O"}
                                </div>
                                <div>
                                    <p className="font-medium">{(activeAgreement as any).ownerName || "Property Owner"}</p>
                                    <p className="text-sm text-muted-foreground">Managed via RentalApp</p>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Button variant="outline" size="sm" className="justify-start">
                                    <Phone className="w-4 h-4 mr-2" /> Call Owner
                                </Button>
                                <Button variant="outline" size="sm" className="justify-start">
                                    <CalendarClock className="w-4 h-4 mr-2" /> Request Extension
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Next Rent Due</CardTitle>
                            <CardDescription className="text-primary-foreground/80">In {diffDays} days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">₹{formatCurrency(activeAgreement.monthlyRent)}</span>
                                <span className="text-sm opacity-80">for {nextRentDate.toLocaleString('default', { month: 'short' })} {nextRentDate.getFullYear()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
