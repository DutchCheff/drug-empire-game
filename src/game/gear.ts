import { CONFIG } from "./config";
import type { Pot } from "./types";

export function lampCost(owned: number) {
    return Math.round(CONFIG.growGear.lamp.baseCost * CONFIG.growGear.lamp.costGrowth ** owned)
}

export function lampsPlaced(pots: Pot[]) {
    return pots.filter((pot) => pot.lamp).length
}