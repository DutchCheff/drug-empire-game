import { CONFIG } from "./config";
import type { Strain, StrainCounts, StrainId } from "./types";

export const STRAINS: Strain[] = [
    {
        id: 'classic',
        name: 'Classic',
        kind: null,
        role: 'Starter',
        growSeconds: 30,
        yieldGrams: 5,
        pricePerGram: 4,
        seedPrice: 5,
        unlockCost: 0,
    },
    {
        id: 'northernLights',
        name: 'Northern Lights',
        kind: 'Indica',
        role: 'Fast · best for clicking',
        growSeconds: 24,
        yieldGrams: 5,
        pricePerGram: 4,
        seedPrice: 6,
        unlockCost: 500,
    },
    {
        id: 'blueDream',
        name: 'Blue Dream',
        kind: 'Hybrid',
        role: 'Bulk · most grams per pot',
        growSeconds: 36,
        yieldGrams: 8,
        pricePerGram: 4,
        seedPrice: 8,
        unlockCost: 1000,
    },
    {
        id: 'sourDiesel',
        name: 'Sour Diesel',
        kind: 'Sativa',
        role: 'All-rounder',
        growSeconds: 40,
        yieldGrams: 7,
        pricePerGram: 6,
        seedPrice: 12,
        unlockCost: 2000,
    },
    {
        id: 'ogKush',
        name: 'OG Kush',
        kind: 'Hybrid',
        role: 'Classic rhythm, better price',
        growSeconds: 30,
        yieldGrams: 5,
        pricePerGram: 7,
        seedPrice: 12,
        unlockCost: 3000,
    },
    {
        id: 'granddaddyPurple',
        name: 'Granddaddy Purple',
        kind: 'Indica',
        role: 'Idle · slow and steady',
        growSeconds: 45,
        yieldGrams: 7,
        pricePerGram: 8,
        seedPrice: 16,
        unlockCost: 5000,
    },
    {
        id: 'girlScoutCookies',
        name: 'Girl Scout Cookies',
        kind: 'Hybrid',
        role: 'Dealer favourite · top price',
        growSeconds: 50,
        yieldGrams: 5,
        pricePerGram: 13,
        seedPrice: 18,
        unlockCost: 8000,
    },
    {
        id: 'gorillaGlue',
        name: 'Gorilla Glue #4',
        kind: 'Hybrid',
        role: 'Big idle · most per action',
        growSeconds: 60,
        yieldGrams: 9,
        pricePerGram: 10,
        seedPrice: 25,
        unlockCost: 12000,
    },
]

export function getStrain(id: StrainId): Strain {
    return STRAINS.find((strain) => strain.id === id) ?? STRAINS[0]
}

export function emptyCounts(): StrainCounts {
    return Object.fromEntries(STRAINS.map((strain) => [strain.id, 0])) as StrainCounts
}

export const BY_PRICE = [...STRAINS].sort((first, second) => second.pricePerGram - first.pricePerGram)

export function totalCount(counts: StrainCounts) {
    return Object.values(counts).reduce((total, count) => total + count, 0)
}

export function takeGrams(stash: StrainCounts, grams: number) {
    const left = { ...stash }
    const byStrain = emptyCounts()
    let taken = 0
    let value = 0
    for (const strain of BY_PRICE) {
        const amount = Math.min(left[strain.id], grams - taken)
        left[strain.id] -= amount
        byStrain[strain.id] = amount
        taken += amount
        value += amount * strain.pricePerGram
    }
    return { stash: left, byStrain, grams: taken, value }
}

export function sellPrice(stash: StrainCounts) {
    return takeGrams(stash, 1).value || STRAINS[0].pricePerGram
}

export function seedBundles(id: StrainId) {
    const bundles = id === 'classic' ? CONFIG.seedBundles.classic : CONFIG.seedBundles.other
    const seedPrice = getStrain(id).seedPrice
    return bundles.map((bundle) => ({
        amount: bundle.amount,
        price: Math.round(bundle.amount * seedPrice * (1 - bundle.discount))
    }))
}

export function nextLocked(unlocked: StrainId[]) {
    return STRAINS.find((strain) => !unlocked.includes(strain.id))
}