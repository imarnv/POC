"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface AddressDetails {
    doorNo: string
    street: string
    area: string
    city: string
    state: string
    landmark?: string
}

interface AddressFormProps {
    onNext: (data: AddressDetails) => void
    onBack: () => void
    initialData?: AddressDetails
}

export function AddressForm({ onNext, onBack, initialData }: AddressFormProps) {
    const [formData, setFormData] = React.useState<AddressDetails>({
        doorNo: initialData?.doorNo || "",
        street: initialData?.street || "",
        area: initialData?.area || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        landmark: initialData?.landmark || "",
    })

    const handleChange = (field: keyof AddressDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Address Details:", formData)
        onNext(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="doorNo">Door No / Flat No</label>
                    <Input
                        id="doorNo"
                        placeholder="Flat 401, A Block"
                        required
                        className="bg-white/50"
                        value={formData.doorNo}
                        onChange={handleChange("doorNo")}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="street">Street Name</label>
                    <Input
                        id="street"
                        placeholder="Main Street"
                        required
                        className="bg-white/50"
                        value={formData.street}
                        onChange={handleChange("street")}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium" htmlFor="area">Area / Location</label>
                    <Input
                        id="area"
                        placeholder="Indiranagar 2nd Stage"
                        required
                        className="bg-white/50"
                        value={formData.area}
                        onChange={handleChange("area")}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="city">City</label>
                    <Input
                        id="city"
                        placeholder="Bangalore"
                        required
                        className="bg-white/50"
                        value={formData.city}
                        onChange={handleChange("city")}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="state">State</label>
                    <Input
                        id="state"
                        placeholder="Karnataka"
                        required
                        className="bg-white/50"
                        value={formData.state}
                        onChange={handleChange("state")}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium" htmlFor="landmark">
                        Landmark <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input
                        id="landmark"
                        placeholder="Near Metro Station"
                        className="bg-white/50"
                        value={formData.landmark}
                        onChange={handleChange("landmark")}
                    />
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack} size="lg">Back</Button>
                <Button type="submit" size="lg">Next: Property Details</Button>
            </div>
        </form>
    )
}
