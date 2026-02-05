"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// Since I didn't create a Label component, I'll use a simple label tag or create one inline.
// Actually, standard accessible label is best.

interface PersonDetailsFormProps {
    onNext: (data: any) => void
    initialData?: any
}

export function PersonDetailsForm({ onNext, initialData }: PersonDetailsFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Gather data (simplified)
        onNext({})
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="firstName">
                        First Name
                    </label>
                    <Input id="firstName" placeholder=" " required className="bg-white/50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="lastName">
                        Last Name
                    </label>
                    <Input id="lastName" placeholder=" " required className="bg-white/50" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="fatherName">
                        Father's Name <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input id="fatherName" placeholder=" " className="bg-white/50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="spouseName">
                        Spouse's Name <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input id="spouseName" placeholder=" " className="bg-white/50" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="primaryMobile">
                        Primary Mobile
                    </label>
                    <Input id="primaryMobile" placeholder=" " required type="tel" className="bg-white/50" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="whatsapp">
                        WhatsApp Number <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input id="whatsapp" placeholder=" " type="tel" className="bg-white/50" />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg">Next: Address Details</Button>
            </div>
        </form>
    )
}
