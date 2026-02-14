import { describe, it, expect } from 'vitest'
import { calculateStatus } from '../utils/agreement-utils'

describe('calculateStatus', () => {
    it('should return ACTIVE for current agreement', () => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setMonth(today.getMonth() - 1) // Started 1 month ago
        const endDate = new Date(today)
        endDate.setMonth(today.getMonth() + 10) // Ends in 10 months

        expect(calculateStatus(startDate, endDate)).toBe('ACTIVE')
    })

    it('should return EXPIRING_SOON if ending within 30 days', () => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setMonth(today.getMonth() - 10)
        const endDate = new Date(today)
        endDate.setDate(today.getDate() + 15) // Ends in 15 days

        expect(calculateStatus(startDate, endDate)).toBe('EXPIRING_SOON')
    })

    it('should return EXPIRED if endDate is in past', () => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setMonth(today.getMonth() - 12)
        const endDate = new Date(today)
        endDate.setDate(today.getDate() - 1) // Ended yesterday

        expect(calculateStatus(startDate, endDate)).toBe('EXPIRED')
    })

    it('should return ACTIVE for future agreement (not yet started)', () => {
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(today.getDate() + 10) // Starts in 10 days
        const endDate = new Date(today)
        endDate.setMonth(today.getMonth() + 12)

        expect(calculateStatus(startDate, endDate)).toBe('ACTIVE')
    })

    it('should handle string dates converted to Date objects', () => {
        // Logic inside service handles Date objects. 
        // If inputs are strings, they need conversion before calling, but service signature expects Date.
        // We test logic assuming correct input type as per Typescript.

        const today = new Date()
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 11, 1);

        expect(calculateStatus(start, end)).toBe('ACTIVE');
    })
})
