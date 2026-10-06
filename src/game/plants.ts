import { CONFIG } from "./config";
import type { PlantStage, Pot } from "./types";

const GROWING: PlantStage[] = [
    'seedling',
    'vegetative',
    'flowering',
]

export const GROW_SECONDS = CONFIG.stageSeconds * GROWING.length

export function getProgress(pot: Pot, now: number) {
    if (pot.plantedAt === null) {
        return 0
    }
    const seconds = (now - pot.plantedAt) / 1000
    return Math.min(seconds / GROW_SECONDS, 1)
}

export function getStage(pot: Pot, now: number): PlantStage {
    if (pot.plantedAt === null) {
        return 'empty'
    }
    const progress = getProgress(pot, now)
    if (progress >= 1) {
        return 'ready'
    }
    const index = Math.floor(progress * GROWING.length)
    return GROWING[index]
}