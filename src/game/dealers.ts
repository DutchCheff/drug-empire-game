import { between, wholeBetween } from '../lib/random'
import { CONFIG } from './config'
import type { Dealer, DealerCandidate, DealerStats, GameState, TripResult } from './types'

type Roll = () => number

const TRIP_MS = CONFIG.dealer.tripSeconds * 1000
const JAIL_MS = CONFIG.dealer.jailSeconds * 1000

const DEALER_NAMES = ['Kev', 'Dre', 'Mo', 'Johnny', 'Sally', 'Bridget']

function rollCandidate(roll: Roll): DealerCandidate {
    const ranges = CONFIG.dealer
    return {
        name: DEALER_NAMES[wholeBetween(roll, 0, DEALER_NAMES.length - 1)],
        stats: {
            capacity: wholeBetween(roll, ranges.capacity[0], ranges.capacity[1]),
            cut: between(roll, ranges.cut[0], ranges.cut[1]),
            robberyChance: between(roll, ranges.robberyChance[0], ranges.robberyChance[1]),
            arrestChance: between(roll, ranges.arrestChance[0], ranges.arrestChance[1]),
        },
    }
}

function score(value: number, worst: number, best: number) {
    return (value - worst) / (best - worst)
}

export function dealerQuality(stats: DealerStats) {
    const ranges = CONFIG.dealer
    const capacity = score(stats.capacity, ranges.capacity[0], ranges.capacity[1])
    const cut = score(stats.cut, ranges.cut[1], ranges.cut[0])
    const robbery = score(stats.robberyChance, ranges.robberyChance[1], ranges.robberyChance[0])
    const arrest = score(stats.arrestChance, ranges.arrestChance[1], ranges.arrestChance[0])
    return capacity * 0.35 + cut * 0.35 + robbery * 0.15 + arrest * 0.15
}

export function rollCandidates(roll: Roll) {
    const candidates: DealerCandidate[] = []
    for (let index = 0; index < CONFIG.dealer.candidateCount; index++) {
        candidates.push(rollCandidate(roll))
    }
    return candidates
}

export function createDealer(id: number, candidate: DealerCandidate): Dealer {
    return { ...candidate, id, status: 'idle', statusSince: null, carrying: 0, carryingValue: 0, lastTrip: null }
}

export function getTripProgress(dealer: Dealer, now: number) {
    if (dealer.status !== 'out' || dealer.statusSince === null) {
        return 0
    }
    return Math.min((now - dealer.statusSince) / TRIP_MS, 1)
}

export function getJailSecondsLeft(dealer: Dealer, now: number) {
    if (dealer.status !== 'jailed' || dealer.statusSince === null) {
        return 0
    }
    return  Math.max(0, Math.ceil((dealer.statusSince + JAIL_MS - now) / 1000))
}

function rollTrip(dealer: Dealer, roll: Roll, at: number): TripResult {
    if (roll() < dealer.stats.arrestChance) {
        return { outcome: 'arrested', grams: dealer.carrying, cash: 0, at }
    }
    if (roll() < dealer.stats.robberyChance) {
        return { outcome: 'robbed', grams: dealer.carrying, cash: 0, at }
    }
    const cash = Math.round(dealer.carryingValue * (1 - dealer.stats.cut))
    return { outcome: 'sold', grams: dealer.carrying, cash, at }
}

export function updateDealers(state: GameState, now: number, roll: Roll): GameState {
    let cash = state.cash
    let changed = false

    const dealers = state.dealers.map((dealer) => {
        let current = dealer
        if (current.status === 'out' && current.statusSince !== null) {
            const backAt = current.statusSince + TRIP_MS
            if (now >= backAt) {
                const trip = rollTrip(current, roll, backAt)
                const arrested = trip.outcome === 'arrested'
                cash += trip.cash
                current = {
                    ...current,
                    status: arrested ? 'jailed' : 'idle',
                    statusSince: arrested ? backAt : null,
                    carrying: 0,
                    carryingValue: 0,
                    lastTrip: trip,
                }
            }
        }
        if (current.status === 'jailed' && current.statusSince !== null && now >= current.statusSince + JAIL_MS) {
            current = { ...current, status: 'idle', statusSince: null }
        }
        if (current !== dealer) {
            changed = true
        }
        return current
    })

    if (!changed) {
        return state
    }
    return { ...state, cash, dealers }
}