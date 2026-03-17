"use client"

import * as React from "react"
import { Building2, MapPin, User, IndianRupee, Plus, X, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/ui/modal"
import Link from "next/link"

type Property = {
    id: string
    name: string
    address: string
    type: string
    tenant: string | null
    rent: number
    status: "OCCUPIED" | "VACANT"
}

const initialProperties: Property[] = [
    {
        id: "1",
        name: "Greenfield Apartments – Flat 402",
        address: "B Block, Electronic City Phase 1, Bengaluru – 560100",
        type: "2 BHK Apartment",
        tenant: "Jane Tenant",
        rent: 25000,
        status: "OCCUPIED",
    },
    {
        id: "2",
        name: "Sunrise Villa – Unit 2",
        address: "12th Cross, Indiranagar, Bengaluru – 560038",
        type: "3 BHK Villa",
        tenant: null,
        rent: 45000,
        status: "VACANT",
    },
]

export default function OwnerPropertiesPage() {
    const [properties, setProperties] = React.useState<Property[]>(initialProperties)
    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [isViewOpen, setIsViewOpen] = React.useState(false)
    const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(null)
    const [addSaved, setAddSaved] = React.useState(false)
    const [newProp, setNewProp] = React.useState({ name: "", address: "", type: "", rent: "" })

    function handleAddProperty() {
        if (!newProp.name || !newProp.address || !newProp.type || !newProp.rent) return
        const prop: Property = {
            id: Date.now().toString(),
            name: newProp.name,
            address: newProp.address,
            type: newProp.type,
            tenant: null,
            rent: Number(newProp.rent),
            status: "VACANT",
        }
        setAddSaved(true)
        setTimeout(() => {
            setProperties(prev => [...prev, prop])
            setNewProp({ name: "", address: "", type: "", rent: "" })
            setAddSaved(false)
            setIsAddOpen(false)
        }, 1200)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Properties</h2>
                    <p className="text-muted-foreground">Manage all your rental properties.</p>
                </div>
                <Button size="lg" onClick={() => setIsAddOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{properties.length}</div>
                        <p className="text-xs text-muted-foreground">Registered properties</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Occupied</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{properties.filter(p => p.status === "OCCUPIED").length}</div>
                        <p className="text-xs text-muted-foreground">Currently rented</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{properties.filter(p => p.status === "OCCUPIED").reduce((s, p) => s + p.rent, 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">From occupied units</p>
                    </CardContent>
                </Card>
            </div>

            {/* Properties List */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">All Properties</h3>
                {properties.map((property) => (
                    <Card key={property.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                        <Building2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-base font-semibold">{property.name}</h4>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    property.status === "OCCUPIED"
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-gray-50 text-gray-600 border-gray-200"
                                                }
                                            >
                                                {property.status === "OCCUPIED" ? "Occupied" : "Vacant"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {property.address}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{property.type}</p>
                                    </div>
                                </div>

                                <div className="text-right space-y-1">
                                    <p className="text-lg font-bold">₹{property.rent.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                                    {property.tenant && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
                                            <User className="w-3.5 h-3.5" /> {property.tenant}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => { setSelectedProperty(property); setIsViewOpen(true) }}
                                >
                                    View Details
                                </Button>
                                {property.status === "VACANT" && (
                                    <Link href="/dashboard/owner/agreements/new">
                                        <Button size="sm">Create Agreement</Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Add Property Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add New Property" description="Fill in the details of your new rental property.">
                {addSaved ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                        <p className="font-semibold text-green-700">Property added successfully!</p>
                    </div>
                ) : (
                    <div className="space-y-4 mt-2">
                        <div className="space-y-1">
                            <Label>Property Name</Label>
                            <Input placeholder="e.g. Sunrise Villa – Unit 3" value={newProp.name} onChange={e => setNewProp(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                            <Label>Address</Label>
                            <Input placeholder="Full address" value={newProp.address} onChange={e => setNewProp(p => ({ ...p, address: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                            <Label>Property Type</Label>
                            <Input placeholder="e.g. 2 BHK Apartment" value={newProp.type} onChange={e => setNewProp(p => ({ ...p, type: e.target.value }))} />
                        </div>
                        <div className="space-y-1">
                            <Label>Monthly Rent (₹)</Label>
                            <Input type="number" placeholder="e.g. 20000" value={newProp.rent} onChange={e => setNewProp(p => ({ ...p, rent: e.target.value }))} />
                        </div>
                        <div className="flex gap-2 pt-1">
                            <Button className="flex-1" onClick={handleAddProperty} disabled={!newProp.name || !newProp.address || !newProp.type || !newProp.rent}>
                                <Plus className="w-4 h-4 mr-2" /> Add Property
                            </Button>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                <X className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* View Details Modal */}
            <Modal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Property Details">
                {selectedProperty && (
                    <div className="space-y-4 mt-2">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><p className="text-muted-foreground text-xs">Name</p><p className="font-medium">{selectedProperty.name}</p></div>
                            <div><p className="text-muted-foreground text-xs">Type</p><p className="font-medium">{selectedProperty.type}</p></div>
                            <div className="col-span-2"><p className="text-muted-foreground text-xs">Address</p><p className="font-medium">{selectedProperty.address}</p></div>
                            <div><p className="text-muted-foreground text-xs">Monthly Rent</p><p className="font-medium">₹{selectedProperty.rent.toLocaleString()}</p></div>
                            <div><p className="text-muted-foreground text-xs">Status</p><p className="font-medium">{selectedProperty.status}</p></div>
                            {selectedProperty.tenant && (
                                <div className="col-span-2"><p className="text-muted-foreground text-xs">Current Tenant</p><p className="font-medium">{selectedProperty.tenant}</p></div>
                            )}
                        </div>
                        <Button className="w-full" onClick={() => setIsViewOpen(false)}>Close</Button>
                    </div>
                )}
            </Modal>
        </div>
    )
}
