import { CONFIG } from './config'
import { getStage } from './plants'
import { loadGame } from './save'
import { wagesPerMinute } from './staff'
import { gameReducer } from './state'
import { dockStatus } from './dock'
import type { GameState } from './types'

export type AwaySummary = {
    seconds: number
    countedSeconds: number
    cashChange: number
    sold: number
    soldCash: number
    robbed: number
    arrested: number
    harvested: number
    loadsSent: number
    gramsSent: number
    wagesPaid: number
    plantsReady: number
    vanWaiting: boolean
}

const PAY_MS = CONFIG.staff.payEverySeconds * 1000

function record(summary: AwaySummary, before: GameState, after: GameState, now: number) {
    before.pots.forEach((pot, index) => {
        if (pot.plantedAt !== after.pots[index].plantedAt && getStage(pot, now) === 'ready') {
            summary.harvested += 1
        }
    })
    after.dealers.forEach((dealer, index) => {
        const previous = before.dealers[index]
        if (dealer.status === 'out' && dealer.statusSince !== previous.statusSince) {
            summary.loadsSent += 1
            summary.gramsSent += dealer.carrying
        }
        if (dealer.lastTrip === null || dealer.lastTrip === previous.lastTrip) {
            return
        }
        if (dealer.lastTrip.outcome === 'sold') {
            summary.sold += 1
            summary.soldCash += dealer.lastTrip.cash
        } else if (dealer.lastTrip.outcome === 'robbed') {
            summary.robbed += 1
        } else {
            summary.arrested += 1
        }
    })
    if (after.nextPayday > before.nextPayday && after.staffPaid) {
        summary.wagesPaid += wagesPerMinute(before.staff) * Math.round((after.nextPayday - before.nextPayday) / PAY_MS)
    }
}

function skipTime(state: GameState, ms: number): GameState {
    return {
        ...state,
        pots: state.pots.map((pot) => ({ 
            ...pot, 
            plantedAt: pot.plantedAt === null ? null : pot.plantedAt + ms,
        })),
        dealers: state.dealers.map((dealer) => ({
            ...dealer, statusSince: dealer.statusSince === null ? null : dealer.statusSince + ms,
        })),
        staff: state.staff.map((member) => ({
            ...member,
            nextActionAt: member.nextActionAt + ms,
            movedAt: member.movedAt + ms,
        })),
        nextPayday: state.nextPayday + ms,
        dock: {
            ...state.dock,
            order: state.dock.order === null ? null : { ...state.dock.order, orderedAt: state.dock.order.orderedAt + ms },
        },
    }
}

export function startGame(now: number) {
    const saved = loadGame(now)
    const awayMs = Math.max(0, now - saved.savedAt)
    const countedMs = Math.min(awayMs, CONFIG.offline.capHours * 3600 * 1000)
    const stepMs = CONFIG.offline.stepSeconds * 1000
    const summary: AwaySummary = {
        seconds: Math.floor(awayMs / 1000),
        countedSeconds: Math.floor(countedMs / 1000),
        cashChange: 0,
        sold: 0,
        soldCash: 0,
        robbed: 0,
        arrested: 0,
        harvested: 0,
        loadsSent: 0,
        gramsSent: 0,
        wagesPaid: 0,
        plantsReady: 0,
        vanWaiting: false,
    }

    let state = saved
    for (let time = saved.savedAt + stepMs; time < saved.savedAt + countedMs; time += stepMs) {
        const next = gameReducer(state, { type: 'tick', now: time })
        record(summary, state, next, time)
        state = next
    }
    state = skipTime(state, awayMs - countedMs)
    const final = gameReducer(state, { type: 'tick', now })
    record(summary, state, final, now)

    summary.cashChange = final.cash - saved.cash
    summary.plantsReady = final.pots.filter((pot) => getStage(pot, now) === 'ready').length
    summary.vanWaiting = dockStatus(final.dock, now) === 'atDock'
    const showSummary = summary.seconds >= CONFIG.awaySummarySeconds
    return { state: final, summary: showSummary ? summary : null }
}