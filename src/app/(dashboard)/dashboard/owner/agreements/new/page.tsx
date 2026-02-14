"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PersonDetailsForm, PersonDetails } from "@/components/forms/person-details-form"
import { AddressForm, AddressDetails } from "@/components/forms/address-form"
import { PropertyDetailsForm, PropertyDetails } from "@/components/forms/property-details-form"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { createAgreementAction } from "@/app/actions/agreement-actions"

const steps = [
    { id: 1, title: "Person Details" },
    { id: 2, title: "Address" },
    { id: 3, title: "Property & Rent" },
]

interface AgreementData {
    personDetails?: PersonDetails
    addressDetails?: AddressDetails
    propertyDetails?: PropertyDetails
}

export default function NewAgreementPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = React.useState(1)
    const [formData, setFormData] = React.useState<AgreementData>({})
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleNext = (data: PersonDetails | AddressDetails) => {
        if (currentStep === 1) {
            setFormData((prev) => ({ ...prev, personDetails: data as PersonDetails }))
        } else if (currentStep === 2) {
            setFormData((prev) => ({ ...prev, addressDetails: data as AddressDetails }))
        }
        setCurrentStep((prev) => Math.min(prev + 1, steps.length + 1))
    }

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = async (data: PropertyDetails) => {
        setIsSubmitting(true)
        const completeData: AgreementData = {
            ...formData,
            propertyDetails: data,
        }
        setFormData(completeData)

        try {
            const { personDetails, addressDetails, propertyDetails } = completeData

            if (!personDetails || !addressDetails || !propertyDetails) {
                console.error("Missing required data")
                return
            }

            const submitData = new FormData()

            // Person Details
            submitData.append("tenantName", `${personDetails.firstName} ${personDetails.lastName}`)
            submitData.append("tenantMobile", personDetails.primaryMobile)
            submitData.append("tenantEmail", personDetails.whatsapp || `${personDetails.primaryMobile}@example.com`) // Fallback
            submitData.append("fatherName", personDetails.fatherName || "")

            // Address Details
            const propertyAddress = `${addressDetails.doorNo}, ${addressDetails.street}, ${addressDetails.area}, ${addressDetails.city}`
            submitData.append("propertyAddress", propertyAddress)
            submitData.append("doorNo", addressDetails.doorNo)
            submitData.append("street", addressDetails.street)
            submitData.append("area", addressDetails.area)
            submitData.append("city", addressDetails.city)
            submitData.append("state", addressDetails.state)
            submitData.append("landmark", addressDetails.landmark || "")

            // Property Details
            submitData.append("propertyType", propertyDetails.propertyType)
            submitData.append("builtUpArea", propertyDetails.builtUpArea.toString())
            submitData.append("configuration", propertyDetails.configuration || "")
            submitData.append("orientation", propertyDetails.orientation || "")
            submitData.append("floorNo", (propertyDetails.floorNo || 0).toString())
            submitData.append("totalFloors", (propertyDetails.totalFloors || 0).toString())
            submitData.append("monthlyRent", propertyDetails.monthlyRent.toString())
            submitData.append("securityDeposit", propertyDetails.securityDeposit.toString())

            // Default Dates (Normally user should pick, but following existing logic)
            const startDate = new Date().toISOString().split('T')[0]
            const endDate = new Date()
            endDate.setFullYear(endDate.getFullYear() + 1)
            const endDateStr = endDate.toISOString().split('T')[0]

            submitData.append("startDate", startDate)
            submitData.append("endDate", endDateStr)

            await createAgreementAction(submitData)
            // Redirect handles by action
        } catch (error) {
            console.error("Error creating agreement:", error)
            alert("Failed to create agreement. Please try again.")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Create New Agreement</h1>
                <p className="text-muted-foreground">Follow the steps to generate a rental agreement.</p>
            </div>

            {/* Progress Stepper */}
            <div className="relative flex items-center justify-between px-8">
                <div className="absolute left-0 top-1/2 w-full h-0.5 bg-muted -z-10" />
                <div
                    className="absolute left-0 top-1/2 h-0.5 bg-primary -z-10 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center bg-muted/30 backdrop-blur-sm p-2 rounded-lg">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${step.id <= currentStep
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {step.id < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form Card */}
            <Card className="border-none shadow-lg mt-8">
                <CardContent className="p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && <PersonDetailsForm onNext={handleNext} initialData={formData.personDetails} />}
                            {currentStep === 2 && <AddressForm onNext={handleNext} onBack={handleBack} initialData={formData.addressDetails} />}
                            {currentStep === 3 && (
                                <>
                                    {isSubmitting ? (
                                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                            <p className="text-muted-foreground">Creating Agreement...</p>
                                        </div>
                                    ) : (
                                        <PropertyDetailsForm onSubmit={handleSubmit} onBack={handleBack} initialData={formData.propertyDetails} />
                                    )}
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}

