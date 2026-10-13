import type { GameState } from "./types";
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
        const loaded: GameState = { ...fresh, ...JSON.parse(saved)}
        return { ...loaded, pots: loaded.pots.map((pot) => ({ ...pot, strain: pot.strain ?? 'classic' })) }
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