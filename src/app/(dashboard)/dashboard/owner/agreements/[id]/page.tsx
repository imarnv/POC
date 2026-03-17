"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Edit, Trash2, Save, X, User, Home, MapPin, IndianRupee, Calendar, FileText, Shield, CheckCircle2, CreditCard, PenTool, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAgreementAction, updateAgreementAction, deleteAgreementAction, getClausesAction, requestESignAction } from "@/app/actions/agreement-actions"
import { AgreementClausesForm, ClauseSelection } from "@/components/forms/agreement-clauses-form"
import type { Agreement } from "@/types/agreement"

export default function AgreementDetailPage() {
    const params = useParams()
    const router = useRouter()
    const agreementId = params.id as string

    // Load agreement from storage
    const [agreement, setAgreement] = React.useState<Agreement | null>(null)
    const [isEditMode, setIsEditMode] = React.useState(false)
    const [editedAgreement, setEditedAgreement] = React.useState<Agreement | null>(null)
    const [clauseTemplates, setClauseTemplates] = React.useState<ClauseSelection[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    // Load agreement on mount
    React.useEffect(() => {
        async function load() {
            setIsLoading(true)
            try {
                const loadedAgreement = await getAgreementAction(agreementId)
                setAgreement(loadedAgreement)
                setEditedAgreement(loadedAgreement)
            } catch (error) {
                console.error("Failed to load agreement", error)
            } finally {
                setIsLoading(false)
            }
        }
        load()
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

    const handleEdit = async () => {
        if (clauseTemplates.length === 0) {
            try {
                const templates = await getClausesAction()
                const mappedTemplates = templates.map((c: any) => ({
                    id: c.id,
                    title: c.title,
                    brief: c.brief,
                    content: c.content,
                    category: c.category,
                    isFree: c.isFree,
                    price: c.price,
                    selected: agreement?.clauses?.some(ac => ac.clauseId === c.id) || c.category === "BASE"
                }))
                setClauseTemplates(mappedTemplates)
            } catch (error) {
                console.error("Failed to load clause templates", error)
            }
        }
        setIsEditMode(true)
    }

    const handleRequestESign = async () => {
        if (!agreement) return
        try {
            await requestESignAction(String(agreement.id))
            setAgreement(prev => prev ? { ...prev, status: "SIGNED" as any } : prev)
            alert("E-Sign request sent successfully! Status updated to SIGNED.")
        } catch (error) {
            console.error("Failed to request E-Sign", error)
            alert("Failed to request E-Sign.")
        }
    }

    const handleSave = async () => {
        if (!editedAgreement) return

        // Check if it's a mock agreement (read-only)
        if (String(editedAgreement.id).startsWith("mock-")) {
            alert("Cannot edit mock agreements. These are read-only examples.")
            setIsEditMode(false)
            return
        }

        try {
            await updateAgreementAction(String(editedAgreement.id), editedAgreement)
            setAgreement(editedAgreement)
            setIsEditMode(false)
            alert("Agreement updated successfully!")
        } catch (error) {
            console.error("Failed to update", error)
            alert("Failed to update agreement.")
        }
    }

    const handleCancel = () => {
        setEditedAgreement(agreement)
        setIsEditMode(false)
    }

    const handleDelete = async () => {
        if (!agreement) return

        // Check if it's a mock agreement (read-only)
        if (String(agreement.id).startsWith("mock-")) {
            alert("Cannot delete mock agreements. These are read-only examples.")
            return
        }

        if (confirm(`Are you sure you want to delete the agreement with ${agreement.tenantName}?`)) {
            try {
                await deleteAgreementAction(String(agreement.id))
                alert("Agreement deleted successfully!")
                router.push("/dashboard/owner/agreements")
            } catch (error) {
                console.error("Failed to delete", error)
                alert("Failed to delete agreement.")
            }
        }
    }

    const handleFieldChange = (field: keyof Agreement, value: any) => {
        setEditedAgreement(prev => prev ? { ...prev, [field]: value } : prev)
    }

    const handleClausesChange = (updatedClauses: ClauseSelection[]) => {
        setEditedAgreement(prev => prev ? { ...prev, clauses: updatedClauses as any } : prev)
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
                                    value={agreement.fatherName || ""}
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
                                        value={agreement.tenantEmail || ""}
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
                                    value={agreement.propertyType || ""}
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
                                        value={agreement.builtUpArea || ""}
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
                                        value={agreement.configuration || ""}
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
                                            value={agreement.floorNo || ""}
                                            onChange={(e) => handleFieldChange("floorNo", Number(e.target.value))}
                                            className="font-semibold w-20"
                                        />
                                        <span className="self-center">of</span>
                                        <Input
                                            type="number"
                                            value={agreement.totalFloors || ""}
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
                                        value={agreement.orientation || ""}
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
                                        value={agreement.doorNo || ""}
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
                                        value={agreement.street || ""}
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
                                        value={agreement.area || ""}
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
                                        value={agreement.landmark || ""}
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
                                        value={agreement.city || ""}
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
                                        value={agreement.state || ""}
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

            {/* High Level Document Sections */}
            <div className="grid gap-6 md:grid-cols-2 mt-8 border-t pt-8">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Executive Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            This rental agreement governs the lease of the property at {agreement.doorNo}, {agreement.street} between {agreement.ownerName || 'the Owner'} and {agreement.tenantName}.
                            It outlines the financial terms, maintenance responsibilities, and usage restrictions agreed upon by both parties to ensure a clear and harmonious tenancy.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <CheckCircle2 className="w-5 h-5" />
                            Objectives
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <li className="text-sm text-muted-foreground">Establish clear terms for property usage and maintenance.</li>
                        <li className="text-sm text-muted-foreground">Define financial obligations including rent and security deposit.</li>
                        <li className="text-sm text-muted-foreground">Provide a legal framework for dispute resolution and termination.</li>
                    </CardContent>
                </Card>
            </div>

            {/* Agreement Clauses Section */}
            <div className="space-y-4 mt-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-6 h-6 text-primary" />
                    Agreement Clauses
                </h3>
                <div className="grid gap-4">
                    {isEditMode ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50">
                            <AgreementClausesForm
                                onSubmit={(selected) => handleClausesChange(selected)}
                                onBack={() => setIsEditMode(false)}
                                initialData={editedAgreement.clauses?.map((c: any) => ({
                                    id: c.clauseId || c.id,
                                    title: c.title,
                                    brief: c.brief,
                                    content: c.content,
                                    category: c.category,
                                    isFree: c.isFree,
                                    price: c.price,
                                    selected: true
                                })) || clauseTemplates}
                            />
                        </div>
                    ) : (
                        <>
                            {agreement.clauses && agreement.clauses.length > 0 ? (
                                <>
                                    {['BASE', 'ADDITIONAL', 'AMENITY', 'CUSTOM'].map(category => {
                                        const categoryClauses = agreement.clauses?.filter(c => c.category === category)
                                        if (!categoryClauses || categoryClauses.length === 0) return null
                                        return (
                                            <div key={category} className="space-y-3">
                                                <h4 className="text-sm font-bold uppercase text-muted-foreground tracking-widest">{category} Clauses</h4>
                                                <div className="grid gap-3">
                                                    {categoryClauses.map(clause => (
                                                        <div key={clause.id} className="p-4 bg-white rounded-xl border border-border/50 shadow-sm">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h5 className="font-bold">{clause.title}</h5>
                                                                {!clause.isFree && <Badge variant="secondary">Paid: ₹{clause.price}</Badge>}
                                                            </div>
                                                            <p className="text-sm text-muted-foreground italic mb-2">"{clause.brief}"</p>
                                                            <div className="p-3 bg-muted/30 rounded-lg text-sm border-l-4 border-primary/20">
                                                                {clause.content.replace(/\[(.*?)\]/g, (match) => match)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            ) : (
                                <div className="p-8 text-center bg-muted/20 rounded-2xl border-2 border-dashed">
                                    <p className="text-muted-foreground">No specific clauses added to this agreement.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Advanced Features Placeholders */}
            <div className="grid gap-6 md:grid-cols-3 mt-8">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Payments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">Integrate payment gateway for automated rent collection.</p>
                        <Button size="sm" variant="outline" className="w-full text-xs" disabled>Setup Payments</Button>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            Media Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">Store property videos and photos (Limit: 5GB).</p>
                        <Button size="sm" variant="outline" className="w-full text-xs" disabled>Upload Media</Button>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <PenTool className="w-4 h-4" />
                            E-Signing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground mb-3">Send for digital signature via Aadhaar/eSign.</p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs hover:bg-primary hover:text-white transition-colors"
                            onClick={handleRequestESign}
                            disabled={agreement.status === "SIGNED" as any}
                        >
                            {agreement.status === "SIGNED" as any ? "Already Signed" : "Request E-Sign"}
                        </Button>
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
