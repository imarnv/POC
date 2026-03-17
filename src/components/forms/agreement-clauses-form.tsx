"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Modal } from "@/components/ui/modal"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
// Sample clause type for the form
export interface ClauseSelection {
    id: string
    title: string
    brief: string
    content: string
    category: string
    isFree: boolean
    price?: number
    selected: boolean
}

interface AgreementClausesFormProps {
    onSubmit: (selectedClauses: ClauseSelection[]) => void
    onBack: () => void
    initialData?: ClauseSelection[]
}

const defaultClauses: ClauseSelection[] = [
    {
        id: "monthly-rent-payment",
        title: "Monthly Rent Payment",
        brief: "Details regarding the monthly rent amount and due date.",
        content: "The Tenant shall pay a monthly rent of ₹[Amount], payable in advance on or before the [Date] of each month.",
        category: "BASE",
        isFree: true,
        selected: true
    },
    {
        id: "late-payment-penalty",
        title: "Late Payment Penalty",
        brief: "Penalty for late rent payment.",
        content: "A late fee of ₹[Amount] per day shall be applicable if the rent remains unpaid after the [Date] of the month.",
        category: "BASE",
        isFree: true,
        selected: true
    },
    {
        id: "security-deposit",
        title: "Security Deposit",
        brief: "Refundable security deposit details.",
        content: "A refundable security deposit of ₹[Amount] is payable by the Tenant to the Owner, returned interest-free upon handover of the premises, subject to deductions for damages or unpaid bills.",
        category: "BASE",
        isFree: true,
        selected: true
    },
    {
        id: "pet-policy",
        title: "Pet Policy",
        brief: "Rules regarding pets on the premises.",
        content: "No pets are allowed on the premises without the prior written consent of the Owner. If permitted, the Tenant assumes full responsibility for any damage or nuisance caused.",
        category: "ADDITIONAL",
        isFree: false,
        price: 500,
        selected: false
    },
    {
        id: "society-maintenance",
        title: "Society Maintenance",
        brief: "Monthly society maintenance charges.",
        content: "Monthly society maintenance charges and sinking fund contributions shall be paid by the [Owner/Tenant] as agreed.",
        category: "AMENITY",
        isFree: true,
        selected: false
    }
]

export function AgreementClausesForm({ onSubmit, onBack, initialData }: AgreementClausesFormProps) {
    const [clauses, setClauses] = React.useState<ClauseSelection[]>(initialData || defaultClauses)
    const [viewingClause, setViewingClause] = React.useState<ClauseSelection | null>(null)

    const toggleClause = (id: string) => {
        setClauses(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c))
    }

    const categories = Array.from(new Set(clauses.map(c => c.category)))

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">Agreement Clauses</h2>
                <p className="text-sm text-muted-foreground">Select the clauses you want to include in the agreement.</p>
            </div>

            <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(category => (
                    <div key={category} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{category}</h3>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                        <div className="grid gap-4">
                            {clauses.filter(c => c.category === category).map(clause => {
                                const isBase = clause.category === "BASE";
                                return (
                                    <div key={clause.id} className={`flex items-start gap-4 p-4 border rounded-xl transition-colors group ${isBase ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'}`}>
                                        {!isBase ? (
                                            <Checkbox
                                                id={clause.id}
                                                checked={clause.selected}
                                                onCheckedChange={() => toggleClause(clause.id)}
                                            />
                                        ) : (
                                            <div className="w-4 h-4 rounded border border-primary bg-primary flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <label htmlFor={clause.id} className="font-medium cursor-pointer">{clause.title}</label>
                                                    {isBase && <Badge variant="outline" className="text-[10px] uppercase py-0 h-4 bg-primary/10 text-primary border-primary/20">Mandatory</Badge>}
                                                </div>
                                                {!clause.isFree && <Badge variant="secondary">₹{clause.price}</Badge>}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{clause.brief}</p>
                                            <button
                                                onClick={() => setViewingClause(clause)}
                                                className="text-xs font-semibold text-primary hover:underline mt-2 flex items-center gap-1"
                                            >
                                                View in detail
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-6 border-t">
                <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                <Button type="button" onClick={() => onSubmit(clauses)}>Continue</Button>
            </div>

            <Modal
                isOpen={!!viewingClause}
                onClose={() => setViewingClause(null)}
                title={viewingClause?.title || ""}
            >
                <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                        {viewingClause?.content.replace(/\[(.*?)\]/g, (match) => `_${match}_`)}
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => setViewingClause(null)}>Close</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
