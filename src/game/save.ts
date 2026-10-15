import type { GameState } from "./types";
import { emptyCounts } from "./strains";
import { createInitialState } from "./state";

const SAVE_KEY = 'drug-empire-save'

export function loadGame(now: number): GameState {
    const fresh = createInitialState(now)
    try {
        const saved = localStorage.getItem(SAVE_KEY)
        if (saved === null) {
            return fresh
        }
        // Fields added in newer versions of the game get their starting value.
        const parsed = JSON.parse(saved)
        const loaded: GameState = { ...fresh, ...parsed }
        const seeds = parsed.seeds ?? { classic: parsed.seedStock ?? 0 }
        const stash = parsed.stash ?? { classic: parsed.grams ?? 0 }
        return {
            ...loaded,
            seeds: { ...emptyCounts(), ...seeds },
            stash: { ...emptyCounts(), ...stash },
            gardenerOrder: parsed.gardenerOrder ?? [...loaded.unlocked].reverse(),
            pots: loaded.pots.map((pot) => ({ ...pot, strain: pot.strain ?? 'classic' })),
            dealers: loaded.dealers.map((dealer) => ({
                ...dealer,
                carryingValue: dealer.carryingValue ?? dealer.carrying * 4,
                load: dealer.load ?? { ...emptyCounts(), classic: dealer.carrying },
                lastTrip: dealer.lastTrip === null ? null : { ...dealer.lastTrip, load: dealer.lastTrip.load ?? emptyCounts() },
            })),
        }
    } catch {
        return fresh
    }
}

export function saveGame(state: GameState) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state))
    } catch {
        // Storage full or blocked: skip this save.
    }
}