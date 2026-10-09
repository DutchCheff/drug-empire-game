import { CONFIG } from './config'
import { getStage } from './plants'
import { loadGame } from './save'
import { gameReducer } from './state'
import type { GameState, TripOutcome } from './types'

export type AwaySummary = {
    seconds: number
    cashEarned: number
    trips: { name: string; outcome: TripOutcome; cash: number }[]
    plantsReady: number
}

function summarizeAway(before: GameState, after: GameState, now: number): AwaySummary | null {
    const seconds = Math.floor((now - before.savedAt) / 1000)
    if (seconds < CONFIG.awaySummarySeconds) {
        return null
    }
    const trips = []
    for (let index = 0; index < after.dealers.length; index++) {
        const dealer = after.dealers[index]
        if (dealer.lastTrip !== null && dealer.lastTrip !== before.dealers[index].lastTrip) {
            trips.push({ name: dealer.name, outcome: dealer.lastTrip.outcome, cash: dealer.lastTrip.cash })
        }
    }
    return {
        seconds,
        cashEarned: after.cash - before.cash,
        trips,
        plantsReady: after.pots.filter((pot) => getStage(pot, now) === 'ready').length,
    }
}

export function startGame(now: number) {
    const saved = loadGame(now)
    const state = gameReducer(saved, { type: 'tick', now })
    return { state, summary: summarizeAway(saved, state, now) }
}