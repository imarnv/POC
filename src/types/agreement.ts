
export interface Agreement {
    id: string | number
    tenantName: string
    tenantMobile: string
    tenantEmail: string
    fatherName: string | null
    propertyAddress: string
    doorNo: string | null
    street: string | null
    area: string | null
    city: string | null
    state: string | null
    landmark: string | null
    propertyType: string | null
    builtUpArea: number | null
    configuration: string | null
    orientation: string | null
    floorNo: number | null
    totalFloors: number | null
    monthlyRent: number
    securityDeposit: number
    startDate: string
    endDate: string
    status: "active" | "expiring_soon" | "expired"
    ownerId?: string
    ownerName?: string
    clauses?: AgreementClause[]
}

export interface AgreementClause {
    id: string
    clauseId?: string
    title: string
    brief: string
    content: string
    category: string
    isFree: boolean
    price?: number
}
