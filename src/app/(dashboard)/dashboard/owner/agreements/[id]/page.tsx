"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Edit, Trash2, Save, X, User, Home, MapPin, IndianRupee, Calendar, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAgreementById, updateAgreement, deleteAgreement, type Agreement } from "@/lib/agreement-storage"

export default function AgreementDetailPage() {
    const params = useParams()
    const router = useRouter()
    const agreementId = params.id as string

    // Load agreement from storage
    const [agreement, setAgreement] = React.useState<Agreement | null>(null)
    const [isEditMode, setIsEditMode] = React.useState(false)
    const [editedAgreement, setEditedAgreement] = React.useState<Agreement | null>(null)

    // Load agreement on mount
    React.useEffect(() => {
        const loadedAgreement = getAgreementById(agreementId)
        setAgreement(loadedAgreement)
        setEditedAgreement(loadedAgreement)
    }, [agreementId])

    // Auto-print if print parameter is present
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('print') === 'true') {
            setTimeout(() => {
                window.print()
            }, 500)
        }
    }, [])

    const handleEdit = () => {
        setIsEditMode(true)
    }

    const handleSave = () => {
        if (!editedAgreement) return

        // Check if it's a mock agreement (read-only)
        if (String(editedAgreement.id).startsWith("mock-")) {
            alert("Cannot edit mock agreements. These are read-only examples.")
            setIsEditMode(false)
            return
        }

        const updated = updateAgreement(editedAgreement.id, editedAgreement)
        if (updated) {
            setAgreement(updated)
            setIsEditMode(false)
            alert("Agreement updated successfully!")
        } else {
            alert("Failed to update agreement.")
        }
    }

    const handleCancel = () => {
        setEditedAgreement(agreement)
        setIsEditMode(false)
    }

    const handleDelete = () => {
        if (!agreement) return

        // Check if it's a mock agreement (read-only)
        if (String(agreement.id).startsWith("mock-")) {
            alert("Cannot delete mock agreements. These are read-only examples.")
            return
        }

        if (confirm(`Are you sure you want to delete the agreement with ${agreement.tenantName}?`)) {
            const deleted = deleteAgreement(agreement.id)
            if (deleted) {
                alert("Agreement deleted successfully!")
                router.push("/dashboard/owner/agreements")
            } else {
                alert("Failed to delete agreement.")
            }
        }
    }

    const handleFieldChange = (field: keyof Agreement, value: any) => {
        setEditedAgreement(prev => prev ? { ...prev, [field]: value } : prev)
    }

    const handleDownloadPDF = () => {
        window.print()
    }

    if (!agreement || !editedAgreement) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Agreement Not Found</h2>
                <p className="text-muted-foreground mb-4">The agreement you're looking for doesn't exist.</p>
                <Button onClick={() => router.push("/dashboard/owner/agreements")}>
                    Back to Agreements
                </Button>
            </div>
        )
    }

    const duration = Math.ceil(
        (new Date(editedAgreement.endDate).getTime() - new Date(editedAgreement.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30)
    )

    // Use editedAgreement for display when in edit mode, otherwise use agreement
    const displayAgreement = isEditMode ? editedAgreement : agreement

    return (
        <div className="space-y-6">
            {/* Header - Hidden in print */}
            <div className="flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Agreement Details</h2>
                        <p className="text-muted-foreground">Agreement ID: #{agreement.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isEditMode ? (
                        <>
                            <Button variant="outline" onClick={handleDownloadPDF}>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                            <Button variant="outline" onClick={handleEdit}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleCancel}>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Print Header - Only visible in print */}
            <div className="hidden print:block text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">RENTAL AGREEMENT</h1>
                <p className="text-muted-foreground">Agreement ID: #{agreement.id}</p>
            </div>

            {/* Status Badge */}
            <div className="print:hidden">
                <Badge
                    variant="outline"
                    className={`text-sm px-4 py-1 ${agreement.status === "active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : agreement.status === "expiring_soon"
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                >
                    {agreement.status === "active" && "Active Agreement"}
                    {agreement.status === "expiring_soon" && "Expiring Soon"}
                    {agreement.status === "expired" && "Expired"}
                </Badge>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Tenant Information */}
                <Card className="border-none shadow-md print:shadow-none print:border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Tenant Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                            {isEditMode ? (
                                <Input
                                    value={displayAgreement.tenantName}
                                    onChange={(e) => handleFieldChange("tenantName", e.target.value)}
                                    className="font-semibold"
                                />
                            ) : (
                                <p className="font-semibold">{displayAgreement.tenantName}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Father's Name</p>
                            {isEditMode ? (
                                <Input
                                    value={agreement.fatherName}
                                    onChange={(e) => handleFieldChange("fatherName", e.target.value)}
                                    className="font-semibold"
                                />
                            ) : (
                                <p className="font-semibold">{agreement.fatherName}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Mobile</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.tenantMobile}
                                        onChange={(e) => handleFieldChange("tenantMobile", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.tenantMobile}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Email</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.tenantEmail}
                                        onChange={(e) => handleFieldChange("tenantEmail", e.target.value)}
                                        className="font-semibold text-sm"
                                    />
                                ) : (
                                    <p className="font-semibold text-sm">{agreement.tenantEmail}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Property Information */}
                <Card className="border-none shadow-md print:shadow-none print:border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Property Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Property Type</p>
                            {isEditMode ? (
                                <Input
                                    value={agreement.propertyType}
                                    onChange={(e) => handleFieldChange("propertyType", e.target.value)}
                                    className="font-semibold"
                                />
                            ) : (
                                <p className="font-semibold">{agreement.propertyType}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Built-up Area</p>
                                {isEditMode ? (
                                    <Input
                                        type="number"
                                        value={agreement.builtUpArea}
                                        onChange={(e) => handleFieldChange("builtUpArea", Number(e.target.value))}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.builtUpArea} sq ft</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Configuration</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.configuration}
                                        onChange={(e) => handleFieldChange("configuration", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.configuration}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Floor</p>
                                {isEditMode ? (
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            value={agreement.floorNo}
                                            onChange={(e) => handleFieldChange("floorNo", Number(e.target.value))}
                                            className="font-semibold w-20"
                                        />
                                        <span className="self-center">of</span>
                                        <Input
                                            type="number"
                                            value={agreement.totalFloors}
                                            onChange={(e) => handleFieldChange("totalFloors", Number(e.target.value))}
                                            className="font-semibold w-20"
                                        />
                                    </div>
                                ) : (
                                    <p className="font-semibold">{agreement.floorNo} of {agreement.totalFloors}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Orientation</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.orientation}
                                        onChange={(e) => handleFieldChange("orientation", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.orientation}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Address */}
                <Card className="border-none shadow-md print:shadow-none print:border md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Property Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Door/Flat No</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.doorNo}
                                        onChange={(e) => handleFieldChange("doorNo", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.doorNo}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Street</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.street}
                                        onChange={(e) => handleFieldChange("street", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.street}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Area</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.area}
                                        onChange={(e) => handleFieldChange("area", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.area}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Landmark</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.landmark}
                                        onChange={(e) => handleFieldChange("landmark", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.landmark}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">City</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.city}
                                        onChange={(e) => handleFieldChange("city", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.city}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">State</p>
                                {isEditMode ? (
                                    <Input
                                        value={agreement.state}
                                        onChange={(e) => handleFieldChange("state", e.target.value)}
                                        className="font-semibold"
                                    />
                                ) : (
                                    <p className="font-semibold">{agreement.state}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Terms */}
                <Card className="border-none shadow-md print:shadow-none print:border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IndianRupee className="w-5 h-5" />
                            Financial Terms
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Monthly Rent</p>
                            {isEditMode ? (
                                <Input
                                    type="number"
                                    value={agreement.monthlyRent}
                                    onChange={(e) => handleFieldChange("monthlyRent", Number(e.target.value))}
                                    className="text-2xl font-bold text-primary"
                                />
                            ) : (
                                <p className="text-2xl font-bold text-primary">₹{agreement.monthlyRent.toLocaleString()}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Security Deposit</p>
                            {isEditMode ? (
                                <Input
                                    type="number"
                                    value={agreement.securityDeposit}
                                    onChange={(e) => handleFieldChange("securityDeposit", Number(e.target.value))}
                                    className="text-xl font-semibold"
                                />
                            ) : (
                                <p className="text-xl font-semibold">₹{agreement.securityDeposit.toLocaleString()}</p>
                            )}
                        </div>
                        <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">Total Contract Value</p>
                            <p className="text-lg font-semibold">₹{(agreement.monthlyRent * duration).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">({duration} months)</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Agreement Timeline */}
                <Card className="border-none shadow-md print:shadow-none print:border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Agreement Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                            {isEditMode ? (
                                <Input
                                    type="date"
                                    value={agreement.startDate}
                                    onChange={(e) => handleFieldChange("startDate", e.target.value)}
                                    className="font-semibold"
                                />
                            ) : (
                                <p className="font-semibold">
                                    {new Date(agreement.startDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">End Date</p>
                            {isEditMode ? (
                                <Input
                                    type="date"
                                    value={agreement.endDate}
                                    onChange={(e) => handleFieldChange("endDate", e.target.value)}
                                    className="font-semibold"
                                />
                            ) : (
                                <p className="font-semibold">
                                    {new Date(agreement.endDate).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            )}
                        </div>
                        <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="text-lg font-semibold">{duration} months</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:block {
                        display: block !important;
                    }
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    .print\\:border {
                        border: 1px solid #e5e7eb !important;
                    }
                }
            `}</style>
        </div>
    )
}
