import { CONFIG } from "./config";

export function nextCost(baseCost: number, growth: number, owned: number) {
    return Math.round(baseCost * Math.pow(growth, owned))
}

export function nextPotCost(potCount: number) {
    const extraPots = potCount - CONFIG.startPots
    return nextCost(CONFIG.pot.baseCost, CONFIG.pot.costGrowth, extraPots)
}