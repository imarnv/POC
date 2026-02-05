"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AddressFormProps {
    onNext: (data: any) => void
    onBack: () => void
    initialData?: any
}

export function AddressForm({ onNext, onBack, initialData }: AddressFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onNext({})
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="doorNo">Door No / Flat No</label>
                    <Input id="doorNo" placeholder="Flat 401, A Block" required className="bg-white/50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="street">Street Name</label>
                    <Input id="street" placeholder="Main Street" required className="bg-white/50" />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium" htmlFor="area">Area / Location</label>
                    <Input id="area" placeholder="Indiranagar 2nd Stage" required className="bg-white/50" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="city">City</label>
                    <Input id="city" placeholder="Bangalore" required className="bg-white/50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="state">State</label>
                    <Input id="state" placeholder="Karnataka" required className="bg-white/50" />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium" htmlFor="landmark">
                        Landmark <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input id="landmark" placeholder="Near Metro Station" className="bg-white/50" />
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack} size="lg">Back</Button>
                <Button type="submit" size="lg">Next: Property Details</Button>
            </div>
        </form>
    )
}
