import { CONFIG } from "./config";
import { makeRoller } from '../lib/random'
import { hireCost, nextPotCost } from './costs'
import { createDealer, rollCandidates, updateDealers } from './dealers'
import { arrivalAt } from './dock'
import { findStaff, payWages } from "./staff";
import { getStage, GROW_SECONDS } from "./plants";
import type { Dealer, GameState, Pot, StaffMember, StaffRole } from "./types";

export type GameAction =
    | { type: 'plant'; potId: number; now: number }
    | { type: 'harvest'; potId: number; now: number }
    | { type: 'sell'; grams: number }
    | { type: 'clickPot'; potId: number; now: number }
    | { type: 'buyPot' }
    | { type: 'hireDealer'; candidateIndex: number }
    | { type: 'sendDealer'; dealerId: number; grams: number; now: number }
    | { type: 'tick'; now: number }
    | { type: 'devSet'; cash: number; grams: number }
    | { type: 'devRipenPots'; now: number }
    | { type: 'buySeeds'; offerIndex: number }
    | { type: 'hireStaff'; role: StaffRole; now: number }
    | { type: 'toggleStaff'; role: StaffRole }
    | { type: 'setMinStash'; grams: number }
    | { type: 'setFullLoadsOnly'; value: boolean }
    | { type: 'buildDock' }
    | { type: 'orderPallet'; offerIndex: number; now: number }
    | { type: 'unloadPallet'; now: number }

export function createInitialState(now: number): GameState {
    const pots: Pot[] = []
    for (let index = 0; index < CONFIG.startPots; index++) {
        pots.push({ id: index + 1, plantedAt: null })
    }
    const roller = makeRoller(now)
    return {
        cash: CONFIG.startCash,
        grams: 0,
        seedStock: CONFIG.startSeeds,
        pots,
        dealers: [],
        candidates: rollCandidates(roller.roll),
        staff: [],
        staffPaid: true,
        nextPayday: 0,
        minStash: CONFIG.staff.defaultMinStash,
        fullLoadsOnly: true,
        dock: { built: false, order: null, lastUnload: null },
        seed: roller.nextSeed(),
        savedAt: now,
    }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'plant': {
            return plant(state, action.potId, action.now)
        }
        case 'harvest': {
            return harvest(state, action.potId, action.now)
        }
        case 'sell': {
            return sell(state, action.grams)
        }
        case 'clickPot': {
            return clickPot(state, action.potId, action.now)
        }
        case 'buyPot': {
            return buyPot(state)
        }
        case 'hireDealer': {
            return hireDealer(state, action.candidateIndex)
        }
        case 'sendDealer': {
            return sendDealer(state, action.dealerId, action.grams, action.now)
        }
        case 'tick': {
            return tick(state, action.now)
        }
        case 'devSet': {
            return { ...state, cash: Math.max(0, action.cash), grams: Math.max(0, Math.floor(action.grams)) }
        }
        case 'devRipenPots': {
            return {
                ...state,
                pots: state.pots.map((pot) => ({ ...pot, plantedAt: action.now - GROW_SECONDS * 1000 })),
            }
        }
        case "buySeeds": {
            return buySeeds(state, action.offerIndex)
        }
        case 'hireStaff': {
            return hireStaff(state, action.role, action.now)
        }
        case 'toggleStaff': {
            return toggleStaff(state, action.role)
        }
        case 'setMinStash': {
            return { ...state, minStash: Math.max(0, Math.floor(action.grams)) }
        }
        case 'setFullLoadsOnly': {
            return { ...state, fullLoadsOnly: action.value }
        }
        case 'buildDock': {
            return buildDock(state)
        }
        case 'orderPallet': {
            return orderPallet(state, action.offerIndex, action.now)
        }
        case 'unloadPallet': {
            return unloadPallet(state, action.now)
        }
    }
}

function plant(state: GameState, potId: number, now: number): GameState {
    const pot = state.pots.find((item) => item.id === potId)
    if (pot === undefined || pot.plantedAt !== null) {
        return state
    }
    if (state.seedStock < 1) {
        return state
    }
    return {
        ...state,
        seedStock: state.seedStock - 1,
        pots: setPlantedAt(state.pots, potId, now),
    }
}

function harvest(state: GameState, potId: number, now: number,): GameState {
    const pot = state.pots.find((item) => item.id === potId)
    if (pot === undefined || getStage(pot, now) !== 'ready') {
        return state
    }
    return {
        ...state,
        grams: state.grams + CONFIG.yieldGrams,
        pots: setPlantedAt(state.pots, potId, null),
    }
}

function clickPot(state: GameState, potId: number, now: number): GameState {
    const pot = state.pots.find((item) => item.id === potId)
    if (pot === undefined) {
        return state
    }
    const stage = getStage(pot, now)
    if (stage === 'empty') {
        return plant(state, potId, now)
    }
    if (stage === 'ready') {
        return harvest(state, potId, now)
    }
    return state
}

function sell(state: GameState, grams: number): GameState {
    const sold = Math.min(grams, state.grams)
    if (sold <= 0) {
        return state
    }
    return {
        ...state,
        grams: state.grams - sold,
        cash: state.cash + sold * CONFIG.pricePerGram
    }
}

function setPlantedAt(pots: Pot[], potId: number, plantedAt: number | null): Pot[] {
    return pots.map((item) => {
        if (item.id !== potId) {
            return item
        }
        return { ...item, plantedAt}
    })
}

function buyPot(state: GameState): GameState {
    if (state.pots.length >= CONFIG.maxPots) {
        return state
    }
    const cost = nextPotCost(state.pots.length)
    if (state.cash < cost) {
        return state
    }
    const newPot: Pot = { id: state.pots.length + 1, plantedAt: null }
    return {
        ...state,
        cash: state.cash - cost,
        pots: [...state.pots, newPot],
    }
}

function hireDealer(state: GameState, candidateIndex: number): GameState {
    const candidate = state.candidates[candidateIndex]
    if (candidate === undefined || state.dealers.length >= CONFIG.dealer.maxDealers) {
        return state
    }
    const cost = hireCost(candidate, state.dealers.length)
    if (state.cash < cost) {
        return state
    }
    const roller = makeRoller(state.seed)
    return {
        ...state,
        cash: state.cash - cost,
        dealers: [...state.dealers, createDealer(state.dealers.length + 1, candidate)],
        candidates: rollCandidates(roller.roll),
        seed: roller.nextSeed(),
    }
}

function sendDealer(state: GameState, dealerId: number, grams: number, now: number): GameState {
    const dealer = state.dealers.find((item) => item.id === dealerId)
    if (dealer === undefined || dealer.status !== 'idle') {
        return state
    }
    const amount = Math.min(Math.floor(grams), dealer.stats.capacity, state.grams)
    if (amount < 1) {
        return state
    }
    return {
        ...state,
        grams: state.grams - amount,
        dealers: state.dealers.map((item): Dealer => {
            if (item.id !== dealerId) {
                return item
            }
            return { ...item, status: 'out', statusSince: now, carrying: amount }
        }),
    }
}

function tick(state: GameState, now: number): GameState {
    const roller = makeRoller(state.seed)
    let next = updateDealers(state, now, roller.roll)
    if (next !== state) {
        next = { ...next, seed: roller.nextSeed() }
    }
    next = payWages(next, now)
    next = runGardener(next, now)
    return runRunner(next, now)
}

function buySeeds(state: GameState, offerIndex: number):GameState {
    const offer = CONFIG.seedOffers[offerIndex]
    if (offer === undefined || state.cash < offer.price) {
        return state
    }
    return { ...state, cash: state.cash - offer.price, seedStock: state.seedStock + offer.amount}
}


function hireStaff(state: GameState, role: StaffRole, now: number): GameState {
    const cost = CONFIG.staff[role].hireCost
    if (findStaff(state.staff, role) !== undefined || state.cash < cost) {
        return state
    }
    const member: StaffMember = { role, enabled: true, nextActionAt: now, potId: null, targetPotId: null, movedAt: now }
    return {
        ...state,
        cash: state.cash - cost,
        staff: [...state.staff, member],
        staffPaid: true,
        nextPayday: state.staff.length === 0 ? now + CONFIG.staff.payEverySeconds * 1000 : state.nextPayday,
    }
}

function toggleStaff(state: GameState, role: StaffRole): GameState {
    return {
        ...state,
        staff: state.staff.map((member) => (member.role === role ? { ...member, enabled: !member.enabled } : member)),
    }
}

function updateGardener(state: GameState, changes: Partial<StaffMember>): GameState {
    return {
        ...state,
        staff: state.staff.map((member) => (member.role === 'gardener' ? { ...member, ...changes } : member)),
    }
}

function tendPot(state: GameState, potId: number, now: number) {
    return plant(harvest(state, potId, now), potId, now)
}

function runGardener(state: GameState, now: number): GameState {
    const gardener = findStaff(state.staff, 'gardener')
    if (gardener === undefined || !gardener.enabled || !state.staffPaid) {
        return state
    }
    const targetPotId = gardener.targetPotId ?? null
    if (targetPotId !== null) {
        if (now < gardener.movedAt + CONFIG.staff.gardener.walkSeconds * 1000) {
            return state
        }
        const next = tendPot(state, targetPotId, now)
        const nextActionAt = next === state ? now : now + CONFIG.staff.gardener.actionSeconds * 1000
        return updateGardener(next, { potId: targetPotId, targetPotId: null, nextActionAt })
    }
    if (now < gardener.nextActionAt) {
        return state
    }
    const ready = state.pots.find((pot) => getStage(pot, now) === 'ready')
    const empty = state.seedStock > 0 ? state.pots.find((pot) => pot.plantedAt === null) : undefined
    const target = ready ?? empty
    if (target === undefined) {
        return state
    }
    return updateGardener(state, { targetPotId: target.id, movedAt: now })
}

function runRunner(state: GameState, now: number): GameState {
    const runner = findStaff(state.staff, 'runner')
    if (runner === undefined || !runner.enabled || !state.staffPaid || now < runner.nextActionAt) {
        return state
    }
    const available = state.grams - state.minStash
    const idle = state.dealers.filter(
        (dealer) => dealer.status === 'idle' && (!state.fullLoadsOnly || dealer.stats.capacity <= available),
    )
    if (idle.length === 0 || available < 1) {
        return state
    }
    const expectedCash = (dealer: Dealer) => Math.min(dealer.stats.capacity, available) * (1 - dealer.stats.cut)
    const best = idle.reduce((choice, dealer) => (expectedCash(dealer) > expectedCash(choice) ? dealer : choice))
    const next = sendDealer(state, best.id, Math.min(best.stats.capacity, available), now)
    const nextActionAt = now + CONFIG.staff.runner.actionSeconds * 1000
    return {
        ...next,
        staff: next.staff.map((member) => (member.role === 'runner' ? { ...member, nextActionAt } : member)),
    }
}

function buildDock(state: GameState): GameState {
    if (state.dock.built || state.cash < CONFIG.dock.buildCost) {
        return state
    }
    return { ...state, cash: state.cash - CONFIG.dock.buildCost, dock: { ...state.dock, built: true } }
}

function orderPallet(state: GameState, offerIndex: number, now: number): GameState {
    const offer = CONFIG.dock.offers[offerIndex]
    if (offer === undefined || !state.dock.built || state.dock.order !== null || state.cash < offer.price) {
        return state
    }
    return {
        ...state,
        cash: state.cash - offer.price,
        dock: { ...state.dock, order: { offerIndex, orderedAt: now } },
    }
}

function unloadPallet(state: GameState, now: number): GameState {
    const order = state.dock.order
    if (order === null || now < arrivalAt(order)) {
        return state
    }
    const amount = CONFIG.dock.offers[order.offerIndex].amount
    return {
        ...state,
        seedStock: state.seedStock + amount,
        dock: { ...state.dock, order: null, lastUnload: { amount, at: now } },
    }
}
