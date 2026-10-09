import { CONFIG } from "./config";
import { dealerQuality } from "./dealers";
import type { DealerCandidate } from "./types";

export function nextCost(baseCost: number, growth: number, owned: number) {
    return Math.round(baseCost * Math.pow(growth, owned))
}

export function nextPotCost(potCount: number) {
    const extraPots = potCount - CONFIG.startPots
    return nextCost(CONFIG.pot.baseCost, CONFIG.pot.costGrowth, extraPots)
}

export function nextDealerCost(dealerCount: number) {
    return nextCost(CONFIG.dealer.baseCost, CONFIG.dealer.costGrowth, dealerCount)
}

export function hireCost(candidate: DealerCandidate, dealerCount: number) {
    const range = CONFIG.dealer.hireCostMultiplier
    const multiplier = range[0] + dealerQuality(candidate.stats) * (range[1] - range[0])
    return Math.round(nextDealerCost(dealerCount) * multiplier)
}