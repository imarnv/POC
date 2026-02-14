export type AgreementStatus = "ACTIVE" | "EXPIRING_SOON" | "EXPIRED"

export function calculateStatus(startDate: Date, endDate: Date): AgreementStatus {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Not started yet or active
    if (now < start) return "ACTIVE" // Future agreement counts as active for now 

    // Expired
    if (now > end) return "EXPIRED"

    // Expiring Soon (Last 30 days)
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntilExpiry <= 30) return "EXPIRING_SOON"

    return "ACTIVE"
}
