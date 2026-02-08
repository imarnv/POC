"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export interface PropertyDetails {
    propertyType: string
    builtUpArea: number
    monthlyRent: number
    securityDeposit: number
    orientation?: string
    floorNo?: number
    totalFloors?: number
    configuration?: string
}

interface PropertyDetailsFormProps {
    onSubmit: (data: PropertyDetails) => void
    onBack: () => void
    initialData?: PropertyDetails
}

export function PropertyDetailsForm({ onSubmit, onBack, initialData }: PropertyDetailsFormProps) {
    const [showMore, setShowMore] = React.useState(false)
    const [formData, setFormData] = React.useState<PropertyDetails>({
        propertyType: initialData?.propertyType || "Residential Apartment",
        builtUpArea: initialData?.builtUpArea || 0,
        monthlyRent: initialData?.monthlyRent || 0,
        securityDeposit: initialData?.securityDeposit || 0,
        orientation: initialData?.orientation || "East Facing",
        floorNo: initialData?.floorNo || undefined,
        totalFloors: initialData?.totalFloors || undefined,
        configuration: initialData?.configuration || "2 BHK",
    })

    const handleChange = (field: keyof PropertyDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === "number" ? Number(e.target.value) : e.target.value
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Property Details:", formData)
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Property Type</label>
                    <select
                        className="flex h-9 w-full rounded-md border border-input bg-white/50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={formData.propertyType}
                        onChange={handleChange("propertyType")}
                    >
                        <option>Residential Apartment</option>
                        <option>Independent House</option>
                        <option>Commercial Office</option>
                        <option>Shop</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Built-up Area (sq ft)</label>
                    <Input
                        placeholder="1200"
                        type="number"
                        required
                        className="bg-white/50"
                        value={formData.builtUpArea || ""}
                        onChange={handleChange("builtUpArea")}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Monthly Rent (₹)</label>
                    <Input
                        placeholder="25000"
                        type="number"
                        required
                        className="bg-white/50"
                        value={formData.monthlyRent || ""}
                        onChange={handleChange("monthlyRent")}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Security Deposit (₹)</label>
                    <Input
                        placeholder="150000"
                        type="number"
                        required
                        className="bg-white/50"
                        value={formData.securityDeposit || ""}
                        onChange={handleChange("securityDeposit")}
                    />
                </div>
            </div>

            <div className="border-t pt-4">
                <button
                    type="button"
                    onClick={() => setShowMore(!showMore)}
                    className="flex items-center text-sm font-medium text-primary hover:underline"
                >
                    {showMore ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                    {showMore ? "Hide Additional Details" : "Show Additional Details"}
                </button>

                {showMore && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Orientation</label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-white/50 px-3 py-1 text-sm shadow-sm"
                                value={formData.orientation}
                                onChange={handleChange("orientation")}
                            >
                                <option>East Facing</option>
                                <option>West Facing</option>
                                <option>North Facing</option>
                                <option>South Facing</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Floor No</label>
                            <Input
                                placeholder="4"
                                type="number"
                                className="bg-white/50"
                                value={formData.floorNo || ""}
                                onChange={handleChange("floorNo")}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Total Floors</label>
                            <Input
                                placeholder="12"
                                type="number"
                                className="bg-white/50"
                                value={formData.totalFloors || ""}
                                onChange={handleChange("totalFloors")}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Configuration</label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-white/50 px-3 py-1 text-sm shadow-sm"
                                value={formData.configuration}
                                onChange={handleChange("configuration")}
                            >
                                <option>2 BHK</option>
                                <option>3 BHK</option>
                                <option>1 BHK</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack} size="lg">Back</Button>
                <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700">Create Agreement</Button>
            </div>
        </form>
    )
}
