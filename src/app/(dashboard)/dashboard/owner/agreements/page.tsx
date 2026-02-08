"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileText, Plus, Calendar, User, IndianRupee, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { loadAgreements, saveAgreement, type Agreement } from "@/lib/agreement-storage"

export default function AgreementsPage() {
    const router = useRouter()
    const [agreements, setAgreements] = React.useState<Agreement[]>([])
    const [isRenewModalOpen, setIsRenewModalOpen] = React.useState(false)
    const [renewingAgreement, setRenewingAgreement] = React.useState<Agreement | null>(null)
    const [newStartDate, setNewStartDate] = React.useState("")
    const [renewalDuration, setRenewalDuration] = React.useState(12) // Default 12 months

    // Load agreements on mount
    React.useEffect(() => {
        setAgreements(loadAgreements())
    }, [])

    const handleRenewClick = (agreement: Agreement) => {
        setRenewingAgreement(agreement)
        // Set default start date to day after current agreement ends
        const endDate = new Date(agreement.endDate)
        endDate.setDate(endDate.getDate() + 1)
        setNewStartDate(endDate.toISOString().split('T')[0])
        setIsRenewModalOpen(true)
    }

    const handleRenewConfirm = () => {
        if (!renewingAgreement || !newStartDate) return

        const startDate = new Date(newStartDate)
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + renewalDuration)

        try {
            // Create new agreement based on the existing one
            const newAgreement = saveAgreement({
                tenantName: renewingAgreement.tenantName,
                tenantMobile: renewingAgreement.tenantMobile,
                tenantEmail: renewingAgreement.tenantEmail,
                fatherName: renewingAgreement.fatherName,
                propertyAddress: renewingAgreement.propertyAddress,
                doorNo: renewingAgreement.doorNo,
                street: renewingAgreement.street,
                area: renewingAgreement.area,
                city: renewingAgreement.city,
                state: renewingAgreement.state,
                landmark: renewingAgreement.landmark,
                propertyType: renewingAgreement.propertyType,
                builtUpArea: renewingAgreement.builtUpArea,
                configuration: renewingAgreement.configuration,
                orientation: renewingAgreement.orientation,
                floorNo: renewingAgreement.floorNo,
                totalFloors: renewingAgreement.totalFloors,
                monthlyRent: renewingAgreement.monthlyRent,
                securityDeposit: renewingAgreement.securityDeposit,
                startDate: newStartDate,
                endDate: endDate.toISOString().split('T')[0],
            })

            console.log("Agreement renewed:", newAgreement)
            alert(`Agreement renewed successfully!\nNew period: ${startDate.toLocaleDateString('en-IN')} to ${endDate.toLocaleDateString('en-IN')}`)

            // Reload agreements
            setAgreements(loadAgreements())
            setIsRenewModalOpen(false)
            setRenewingAgreement(null)
        } catch (error) {
            console.error("Error renewing agreement:", error)
            alert("Failed to renew agreement. Please try again.")
        }
    }

    const calculateNewEndDate = () => {
        if (!newStartDate) return ""
        const startDate = new Date(newStartDate)
        const endDate = new Date(startDate)
        endDate.setMonth(endDate.getMonth() + renewalDuration)
        return endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    }

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
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Within 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹1,50,000</div>
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
                                                        agreement.status === "active"
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : agreement.status === "expiring_soon"
                                                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                                                : "bg-gray-50 text-gray-700 border-gray-200"
                                                    }
                                                >
                                                    {agreement.status === "active" && "Active"}
                                                    {agreement.status === "expiring_soon" && "Expiring Soon"}
                                                    {agreement.status === "expired" && "Expired"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {agreement.propertyAddress}
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
                                                {new Date(agreement.startDate).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">End Date</p>
                                            <p className="text-sm font-semibold">
                                                {new Date(agreement.endDate).toLocaleDateString('en-IN', {
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
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                // Navigate to detail page and trigger print
                                                window.location.href = `/dashboard/owner/agreements/${agreement.id}?print=true`
                                            }}
                                        >
                                            Download PDF
                                        </Button>
                                        {agreement.status === "expiring_soon" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                onClick={() => handleRenewClick(agreement)}
                                            >
                                                Renew Agreement
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State (if no agreements) */}
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

            {/* Renew Agreement Modal */}
            <Modal
                isOpen={isRenewModalOpen}
                onClose={() => {
                    setIsRenewModalOpen(false)
                    setRenewingAgreement(null)
                }}
                title="Renew Agreement"
                description="Create a new agreement period for this tenant"
            >
                {renewingAgreement && (
                    <div className="space-y-6">
                        {/* Current Agreement Info */}
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <h4 className="font-semibold text-sm">Current Agreement</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Tenant</p>
                                    <p className="font-medium">{renewingAgreement.tenantName}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Monthly Rent</p>
                                    <p className="font-medium">₹{renewingAgreement.monthlyRent.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Current End Date</p>
                                    <p className="font-medium">
                                        {new Date(renewingAgreement.endDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* New Agreement Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">New Start Date</label>
                                <Input
                                    type="date"
                                    value={newStartDate}
                                    onChange={(e) => setNewStartDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Renewal Duration (months)</label>
                                <Input
                                    type="number"
                                    value={renewalDuration}
                                    onChange={(e) => setRenewalDuration(Number(e.target.value))}
                                    min={1}
                                    max={60}
                                />
                            </div>

                            {newStartDate && (
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">New Agreement Period</p>
                                    <p className="font-semibold">
                                        {new Date(newStartDate).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                        {' to '}
                                        {calculateNewEndDate()}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Duration: {renewalDuration} months
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsRenewModalOpen(false)
                                    setRenewingAgreement(null)
                                }}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRenewConfirm}
                                disabled={!newStartDate}
                                className="flex-1"
                            >
                                Confirm Renewal
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
