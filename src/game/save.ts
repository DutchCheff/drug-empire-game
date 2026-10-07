import type { GameState } from "./types";

const SAVE_KEY = 'drug-empire-save'

export function loadGame(): GameState | null {
    try {
        const saved = localStorage.getItem(SAVE_KEY)
        if (saved === null) {
            return null
        }
        return JSON.parse(saved) as GameState
    } catch {
        return null
    }
}

export function saveGame(state: GameState) {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state))
    } catch {
        // Storage full or blocked: skip this save.
    }
}