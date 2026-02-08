// Agreement storage utility using localStorage
// This provides CRUD operations for agreements with client-side persistence

export interface Agreement {
    id: string | number
    tenantName: string
    tenantMobile: string
    tenantEmail: string
    fatherName: string
    propertyAddress: string
    doorNo: string
    street: string
    area: string
    city: string
    state: string
    landmark: string
    propertyType: string
    builtUpArea: number
    configuration: string
    orientation: string
    floorNo: number
    totalFloors: number
    monthlyRent: number
    securityDeposit: number
    startDate: string
    endDate: string
    status: "active" | "expiring_soon" | "expired"
}

const STORAGE_KEY = "rental_agreements"

// Mock data for initial state
const mockAgreements: Agreement[] = [
    {
        id: "mock-1",
        tenantName: "Rahul Sharma",
        tenantMobile: "9876543210",
        tenantEmail: "rahul.sharma@email.com",
        fatherName: "Vijay Sharma",
        propertyAddress: "Flat 401, A Block, Greenfield Apartments",
        doorNo: "Flat 401, A Block",
        street: "Greenfield Road",
        area: "Electronic City",
        city: "Bangalore",
        state: "Karnataka",
        landmark: "Near Metro Station",
        propertyType: "Residential Apartment",
        builtUpArea: 1200,
        configuration: "2 BHK",
        orientation: "East Facing",
        floorNo: 4,
        totalFloors: 12,
        monthlyRent: 25000,
        securityDeposit: 150000,
        startDate: "2024-01-15",
        endDate: "2025-01-14",
        status: "active",
    },
    {
        id: "mock-2",
        tenantName: "Priya Patel",
        tenantMobile: "9123456789",
        tenantEmail: "priya.patel@email.com",
        fatherName: "Ramesh Patel",
        propertyAddress: "Villa 12, Sunrise Residency, Koramangala",
        doorNo: "Villa 12",
        street: "Sunrise Avenue",
        area: "Koramangala 5th Block",
        city: "Bangalore",
        state: "Karnataka",
        landmark: "Opposite Park",
        propertyType: "Independent House",
        builtUpArea: 2400,
        configuration: "3 BHK",
        orientation: "North Facing",
        floorNo: 1,
        totalFloors: 2,
        monthlyRent: 40000,
        securityDeposit: 240000,
        startDate: "2023-11-01",
        endDate: "2024-10-31",
        status: "expiring_soon",
    },
    {
        id: "mock-3",
        tenantName: "Amit Kumar",
        tenantMobile: "9988776655",
        tenantEmail: "amit.kumar@email.com",
        fatherName: "Suresh Kumar",
        propertyAddress: "Shop 5, Lakeside Commercial Complex",
        doorNo: "Shop 5",
        street: "Lakeside Road",
        area: "HSR Layout",
        city: "Bangalore",
        state: "Karnataka",
        landmark: "Near Lake",
        propertyType: "Commercial Office",
        builtUpArea: 800,
        configuration: "Open Space",
        orientation: "West Facing",
        floorNo: 1,
        totalFloors: 5,
        monthlyRent: 85000,
        securityDeposit: 510000,
        startDate: "2023-06-01",
        endDate: "2023-12-31",
        status: "expired",
    },
]

/**
 * Calculate agreement status based on dates
 */
function calculateStatus(startDate: string, endDate: string): "active" | "expiring_soon" | "expired" {
    const now = new Date()
    const end = new Date(endDate)
    const start = new Date(startDate)

    // If not started yet or already ended
    if (now < start) return "active" // Future agreement
    if (now > end) return "expired"

    // Calculate days until expiry
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Expiring soon if less than 60 days
    if (daysUntilExpiry <= 60) return "expiring_soon"

    return "active"
}

/**
 * Load all agreements from localStorage, merged with mock data
 */
export function loadAgreements(): Agreement[] {
    if (typeof window === "undefined") return mockAgreements

    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const userAgreements: Agreement[] = stored ? JSON.parse(stored) : []

        // Update status for all agreements based on current date
        const updatedUserAgreements = userAgreements.map(agreement => ({
            ...agreement,
            status: calculateStatus(agreement.startDate, agreement.endDate)
        }))

        const updatedMockAgreements = mockAgreements.map(agreement => ({
            ...agreement,
            status: calculateStatus(agreement.startDate, agreement.endDate)
        }))

        // Combine mock data with user-created agreements
        return [...updatedMockAgreements, ...updatedUserAgreements]
    } catch (error) {
        console.error("Error loading agreements:", error)
        return mockAgreements
    }
}

/**
 * Save a new agreement to localStorage
 */
export function saveAgreement(agreement: Omit<Agreement, "id" | "status">): Agreement {
    if (typeof window === "undefined") throw new Error("Cannot save in server environment")

    try {
        // Generate unique ID
        const id = `agreement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Calculate status
        const status = calculateStatus(agreement.startDate, agreement.endDate)

        const newAgreement: Agreement = {
            ...agreement,
            id,
            status
        }

        // Load existing user agreements (not mock data)
        const stored = localStorage.getItem(STORAGE_KEY)
        const userAgreements: Agreement[] = stored ? JSON.parse(stored) : []

        // Add new agreement
        userAgreements.push(newAgreement)

        // Save back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userAgreements))

        return newAgreement
    } catch (error) {
        console.error("Error saving agreement:", error)
        throw error
    }
}

/**
 * Update an existing agreement
 */
export function updateAgreement(id: string | number, updates: Partial<Agreement>): Agreement | null {
    if (typeof window === "undefined") throw new Error("Cannot update in server environment")

    try {
        // Check if it's a mock agreement (read-only)
        if (String(id).startsWith("mock-")) {
            console.warn("Cannot update mock agreements")
            return null
        }

        const stored = localStorage.getItem(STORAGE_KEY)
        const userAgreements: Agreement[] = stored ? JSON.parse(stored) : []

        const index = userAgreements.findIndex(a => a.id === id)
        if (index === -1) return null

        // Update agreement
        const updatedAgreement = {
            ...userAgreements[index],
            ...updates,
            id, // Ensure ID doesn't change
        }

        // Recalculate status if dates changed
        if (updates.startDate || updates.endDate) {
            updatedAgreement.status = calculateStatus(
                updatedAgreement.startDate,
                updatedAgreement.endDate
            )
        }

        userAgreements[index] = updatedAgreement
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userAgreements))

        return updatedAgreement
    } catch (error) {
        console.error("Error updating agreement:", error)
        throw error
    }
}

/**
 * Delete an agreement
 */
export function deleteAgreement(id: string | number): boolean {
    if (typeof window === "undefined") throw new Error("Cannot delete in server environment")

    try {
        // Check if it's a mock agreement (read-only)
        if (String(id).startsWith("mock-")) {
            console.warn("Cannot delete mock agreements")
            return false
        }

        const stored = localStorage.getItem(STORAGE_KEY)
        const userAgreements: Agreement[] = stored ? JSON.parse(stored) : []

        const filtered = userAgreements.filter(a => a.id !== id)

        if (filtered.length === userAgreements.length) return false // Not found

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
        return true
    } catch (error) {
        console.error("Error deleting agreement:", error)
        throw error
    }
}

/**
 * Get a single agreement by ID
 */
export function getAgreementById(id: string | number): Agreement | null {
    const agreements = loadAgreements()
    return agreements.find(a => String(a.id) === String(id)) || null
}

/**
 * Clear all user-created agreements (for testing)
 */
export function clearAllAgreements(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
}
