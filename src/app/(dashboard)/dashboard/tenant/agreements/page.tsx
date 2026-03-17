"use client"

import * as React from "react"
import { FileText, Download, Calendar, Home, IndianRupee, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockAgreements = [
    {
        id: "1",
        property: "Flat 402, B Block, Greenfield Apartments, Electronic City Phase 1, Bengaluru",
        ownerName: "Arnav Mehta",
        monthlyRent: 25000,
        deposit: 150000,
        startDate: "20 Jan 2026",
        endDate: "19 Jan 2027",
        status: "ACTIVE",
    },
]

function downloadAgreementPDF(ownerName: string, property: string, rent: number) {
    const content = `RENTAL AGREEMENT\n\n` +
        `Owner: ${ownerName}\n` +
        `Property: ${property}\n` +
        `Monthly Rent: Rs. ${rent.toLocaleString()}\n\n` +
        `This is a digitally generated agreement for POC purposes.\n` +
        `Generated on: ${new Date().toLocaleDateString("en-IN")}\n`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "rental-agreement.txt"
    a.click()
    URL.revokeObjectURL(url)
}

export default function TenantAgreementsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">My Agreements</h2>
                <p className="text-muted-foreground">All your rental agreements in one place.</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Currently active</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹25,000</div>
                        <p className="text-xs text-muted-foreground">Per month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lease Expires</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Jan 2027</div>
                        <p className="text-xs text-muted-foreground">11 months left</p>
                    </CardContent>
                </Card>
            </div>

            {/* Agreements List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">All Agreements</h3>

                {mockAgreements.map((agreement) => (
                    <Card key={agreement.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-start justify-between flex-wrap gap-3">
                                <div className="flex items-start gap-3">
                                    <Home className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold">{agreement.property}</p>
                                        <p className="text-sm text-muted-foreground">Owner: {agreement.ownerName}</p>
                                    </div>
                                </div>
                                <Badge className="bg-green-600">Active</Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                                <div>
                                    <p className="text-xs text-muted-foreground">Monthly Rent</p>
                                    <p className="text-sm font-semibold">₹{agreement.monthlyRent.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Security Deposit</p>
                                    <p className="text-sm font-semibold">₹{agreement.deposit.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Start Date</p>
                                    <p className="text-sm font-semibold">{agreement.startDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">End Date</p>
                                    <p className="text-sm font-semibold">{agreement.endDate}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                                <div className="flex items-center gap-2 text-green-700 text-sm">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Agreement Verified &amp; Digitally Signed</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => downloadAgreementPDF(agreement.ownerName, agreement.property, agreement.monthlyRent)}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {mockAgreements.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No agreements found</h3>
                            <p className="text-sm text-muted-foreground">Your rental agreements will appear here.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
