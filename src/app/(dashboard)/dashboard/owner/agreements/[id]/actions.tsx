"use client"

import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"
import { deleteAgreementAction } from "@/app/actions/agreement-actions"

export function AgreementActions({ agreementId }: { agreementId: string }) {
    const handleDownloadPDF = () => {
        window.print()
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this agreement?")) {
            await deleteAgreementAction(agreementId)
        }
    }

    return (
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
            </Button>
            <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
            </Button>
        </div>
    )
}
