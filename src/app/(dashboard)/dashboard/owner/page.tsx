"use client"

import * as React from "react"
import { Building2, FileText, IndianRupee, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function OwnerDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">+1 added last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">98% occupancy rate</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹65,000</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Agreements</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">1 expiring soon</p>
                    </CardContent>
                </Card>
            </div>

            {/* Property List Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>My Properties</CardTitle>
                        <CardDescription>
                            Manage your residential and commercial properties.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Property Item 1 */}
                            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border hover:bg-muted/60 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Greenfield Apartments</p>
                                        <p className="text-sm text-muted-foreground">Electronic City, Bangalore</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-1">Occupied</Badge>
                                    <p className="text-sm font-medium">₹25,000/mo</p>
                                </div>
                            </div>

                            {/* Property Item 2 */}
                            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border hover:bg-muted/60 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Sunrise Villa</p>
                                        <p className="text-sm text-muted-foreground">Koramangala, Bangalore</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mb-1">Occupied</Badge>
                                    <p className="text-sm font-medium">₹40,000/mo</p>
                                </div>
                            </div>

                            {/* Property Item 3 */}
                            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border hover:bg-muted/60 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Lakeside Commercial</p>
                                        <p className="text-sm text-muted-foreground">HSR Layout, Bangalore</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mb-1">Vacant</Badge>
                                    <p className="text-sm font-medium">₹85,000/mo</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="col-span-3 border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest updates from your tenants.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            <div className="flex items-center">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Rahul v. paid rent</p>
                                    <p className="text-xs text-muted-foreground">2 hours ago • Greenfield Apts</p>
                                </div>
                                <div className="ml-auto font-medium text-green-600">+₹25,000</div>
                            </div>
                            <div className="flex items-center">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">New maintenance request</p>
                                    <p className="text-xs text-muted-foreground">5 hours ago • Sunrise Villa</p>
                                </div>
                                <div className="ml-auto font-medium text-orange-600">Pending</div>
                            </div>
                            <div className="flex items-center">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">Lease expiring soon</p>
                                    <p className="text-xs text-muted-foreground">2 days ago • Greenfield Apts</p>
                                </div>
                                <div className="ml-auto font-medium">Review</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
