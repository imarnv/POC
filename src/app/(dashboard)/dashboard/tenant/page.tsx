"use client"

import * as React from "react"
import { CalendarClock, Download, Home, IndianRupee, Phone, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TenantDashboard() {
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
                            <CardTitle className="text-xl">Greenfield Apartments</CardTitle>
                            <Badge className="bg-green-600">Active Lease</Badge>
                        </div>
                        <CardDescription>Flat 402, B Block, Electronic City Phase 1</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Monthly Rent</p>
                                <p className="text-2xl font-bold flex items-center"><IndianRupee className="w-4 h-4 mr-1" /> 25,000</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
                                <p className="text-lg font-medium flex items-center">5th of every month</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Lease Ends</p>
                                <p className="text-lg font-medium">Jan 20, 2027</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Deposit</p>
                                <p className="text-lg font-medium">₹ 1,50,000</p>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-900">Agreement Verified</p>
                                <p className="text-xs text-blue-700">Your rental agreement is digitally signed and valid.</p>
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
                                <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-lg font-bold">
                                    JS
                                </div>
                                <div>
                                    <p className="font-medium">Arnav Mehta</p>
                                    <p className="text-sm text-muted-foreground">Property Owner</p>
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
                            <CardDescription className="text-primary-foreground/80">In 12 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold">₹25,000</span>
                                <span className="text-sm opacity-80">for Feb 2026</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
