"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface PersonDetails {
    firstName: string
    lastName: string
    fatherName?: string
    spouseName?: string
    primaryMobile: string
    whatsapp?: string
}

interface PersonDetailsFormProps {
    onNext: (data: PersonDetails) => void
    initialData?: PersonDetails
}

export function PersonDetailsForm({ onNext, initialData }: PersonDetailsFormProps) {
    const [formData, setFormData] = React.useState<PersonDetails>({
        firstName: initialData?.firstName || "",
        lastName: initialData?.lastName || "",
        fatherName: initialData?.fatherName || "",
        spouseName: initialData?.spouseName || "",
        primaryMobile: initialData?.primaryMobile || "",
        whatsapp: initialData?.whatsapp || "",
    })

    const handleChange = (field: keyof PersonDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Person Details:", formData)
        onNext(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="firstName">
                        First Name
                    </label>
                    <Input 
                        id="firstName" 
                        placeholder="Enter first name" 
                        required 
                        className="bg-white/50"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="lastName">
                        Last Name
                    </label>
                    <Input 
                        id="lastName" 
                        placeholder="Enter last name" 
                        required 
                        className="bg-white/50"
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="fatherName">
                        Father's Name <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input 
                        id="fatherName" 
                        placeholder="Enter father's name" 
                        className="bg-white/50"
                        value={formData.fatherName}
                        onChange={handleChange("fatherName")}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="spouseName">
                        Spouse's Name <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input 
                        id="spouseName" 
                        placeholder="Enter spouse's name" 
                        className="bg-white/50"
                        value={formData.spouseName}
                        onChange={handleChange("spouseName")}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="primaryMobile">
                        Primary Mobile
                    </label>
                    <Input 
                        id="primaryMobile" 
                        placeholder="Enter mobile number" 
                        required 
                        type="tel"
                        pattern="[0-9]{10}"
                        className="bg-white/50"
                        value={formData.primaryMobile}
                        onChange={handleChange("primaryMobile")}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="whatsapp">
                        WhatsApp Number <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <Input 
                        id="whatsapp" 
                        placeholder="Enter WhatsApp number" 
                        type="tel"
                        pattern="[0-9]{10}"
                        className="bg-white/50"
                        value={formData.whatsapp}
                        onChange={handleChange("whatsapp")}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg">Next: Address Details</Button>
            </div>
        </form>
    )
}
