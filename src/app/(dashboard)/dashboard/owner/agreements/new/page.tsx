"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PersonDetailsForm } from "@/components/forms/person-details-form"
import { AddressForm } from "@/components/forms/address-form"
import { PropertyDetailsForm } from "@/components/forms/property-details-form"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"

const steps = [
    { id: 1, title: "Person Details" },
    { id: 2, title: "Address" },
    { id: 3, title: "Property & Rent" },
]

export default function NewAgreementPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = React.useState(1)
    const [formData, setFormData] = React.useState({})
    const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)

    const handleNext = (data: any) => {
        setFormData((prev) => ({ ...prev, ...data }))
        setCurrentStep((prev) => Math.min(prev + 1, steps.length + 1))
    }

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = (data: any) => {
        setFormData((prev) => ({ ...prev, ...data }))
        setIsSuccessModalOpen(true)
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
                            {currentStep === 1 && <PersonDetailsForm onNext={handleNext} />}
                            {currentStep === 2 && <AddressForm onNext={handleNext} onBack={handleBack} />}
                            {currentStep === 3 && <PropertyDetailsForm onSubmit={handleSubmit} onBack={handleBack} />}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>

            {/* Success Modal */}
            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                className="text-center space-y-4"
            >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Agreement Created!</h2>
                <p className="text-muted-foreground">The draft has been sent to the tenant for verification.</p>
                <div className="pt-4 flex justify-center gap-4">
                    <Button variant="outline" onClick={() => router.push("/dashboard/owner")}>Go to Dashboard</Button>
                    <Button onClick={() => router.push("/dashboard/owner/agreements")}>View Agreement</Button>
                </div>
            </Modal>
        </div>
    )
}
