import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const clauses = [
        // Rent & Financial Terms
        {
            title: 'Monthly Rent Payment',
            brief: 'Details regarding the monthly rent amount and due date.',
            content: 'The Tenant shall pay a monthly rent of ₹[Amount], payable in advance on or before the [Date] of each month.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Late Payment Penalty',
            brief: 'Penalty for late rent payment.',
            content: 'A late fee of ₹[Amount] per day shall be applicable if the rent remains unpaid after the [Date] of the month.',
            category: 'ADDITIONAL',
            isFree: true,
        },
        {
            title: 'Security Deposit',
            brief: 'Refundable security deposit details.',
            content: 'A refundable security deposit of ₹[Amount] is payable by the Tenant to the Owner, returned interest-free upon handover of the premises, subject to deductions for damages or unpaid bills.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'No GST Clause',
            brief: 'Exemption from GST for residential purposes.',
            content: 'The premises are leased for residential purposes; hence, the rent is exempt from GST as per current government regulations. Should the law change, the tax implication will be reviewed by both parties.',
            category: 'BASE',
            isFree: true,
        },
        // Maintenance & Utilities
        {
            title: 'Utility Bills',
            brief: 'Tenant responsibility for utility payments.',
            content: 'The Tenant is responsible for the timely payment of electricity, water, internet, and any other utility charges directly to the respective authorities.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Routine Maintenance',
            brief: 'Cost of minor repairs and routine internal maintenance.',
            content: 'The Tenant shall bear the cost of minor repairs and routine internal maintenance (e.g., bulb replacements, tap washers, minor plumbing).',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Major Structural Repairs',
            brief: 'Owner responsibility for major structural repairs.',
            content: 'The Owner remains responsible for major structural repairs and external leakages, provided they are not caused by Tenant negligence.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Society Maintenance',
            brief: 'Monthly society maintenance charges and sinking fund.',
            content: 'Monthly society maintenance charges and sinking fund contributions shall be paid by the [Owner/Tenant] as agreed.',
            category: 'AMENITY',
            isFree: true,
        },
        // Usage & Restrictions
        {
            title: 'Residential Purpose',
            brief: 'Premises used strictly for residential purposes.',
            content: 'The premises shall be used strictly for residential purposes only and shall not be used for any commercial, professional, or illegal activities.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Pet Policy',
            brief: 'Rules regarding pets on the premises.',
            content: 'No pets are allowed on the premises without the prior written consent of the Owner. If permitted, the Tenant assumes full responsibility for any damage or nuisance caused.',
            category: 'ADDITIONAL',
            isFree: true,
        },
        {
            title: 'No Subletting',
            brief: 'Prohibition of subletting the premises.',
            content: 'The Tenant is prohibited from subletting, assigning, or parting with the possession of the premises to any third party.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Permanent Alterations',
            brief: 'No structural changes without written permission.',
            content: 'No permanent or structural changes (e.g., wall removal, permanent fixtures, repainting) shall be made without the Owner\'s written permission.',
            category: 'BASE',
            isFree: true,
        },
        // Term & Termination
        {
            title: 'Lock-in Period',
            brief: 'Minimum period before agreement termination.',
            content: 'Both parties agree to a lock-in period of [X] months, during which neither party can terminate the agreement except for a breach of terms.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Notice Period',
            brief: 'Written notice required for termination.',
            content: 'After the lock-in period, either party may terminate the agreement by providing [X] months\' written notice.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Lease Renewal',
            brief: 'Terms for renewal and rent escalation.',
            content: 'Terms for renewal, including any rent escalation (typically 5-10%), must be discussed [X] days prior to the agreement\'s expiry.',
            category: 'BASE',
            isFree: true,
        },
        // Inspection & Handover
        {
            title: 'Owner\'s Right of Entry',
            brief: 'Owner\'s right to inspect the premises.',
            content: 'The Owner or their representative has the right to inspect the premises during reasonable hours, subject to a prior [X]-hour notice to the Tenant.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Property Condition',
            brief: 'Handover and return condition of the premises.',
            content: 'The premises are handed over in good condition. The Tenant shall return the property in the same state, allowing for normal wear and tear.',
            category: 'BASE',
            isFree: true,
        },
        {
            title: 'Exit Cleaning & Painting',
            brief: 'Costs deducted from security deposit upon vacating.',
            content: 'Upon vacating, the cost of professional cleaning and repainting (if applicable) shall be deducted from the security deposit as agreed.',
            category: 'ADDITIONAL',
            isFree: true,
        },
        // Legal & Compliance
        {
            title: 'Police Verification',
            brief: 'Mandatory police verification of the Tenant.',
            content: 'This agreement is subject to the successful completion of mandatory police verification of the Tenant as per local law enforcement requirements.',
            category: 'ADDITIONAL',
            isFree: true,
        },
        {
            title: 'Dispute Resolution',
            brief: 'Jurisdiction for any disputes arising.',
            content: 'Any disputes arising under this agreement shall be subject to the exclusive jurisdiction of the courts located in [City Name].',
            category: 'BASE',
            isFree: true,
        }
    ]

    for (const clause of clauses) {
        await (prisma as any).clause.upsert({
            where: { id: clause.title.replace(/\s+/g, '-').toLowerCase() }, // Using title as a pseudo-id for seed
            update: {},
            create: {
                ...clause,
                id: clause.title.replace(/\s+/g, '-').toLowerCase(),
            },
        })
    }

    console.log('Seed data for clauses inserted successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
