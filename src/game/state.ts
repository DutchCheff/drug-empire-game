import { CONFIG } from "./config";
import { makeRoller } from '../lib/random'
import { hireCost, nextPotCost } from './costs'
import { createDealer, rollCandidates, updateDealers } from './dealers'
import { arrivalAt } from './dock'
import { findStaff, gardenerPick, payWages } from "./staff";
import { getStage, growSeconds } from "./plants";
import { emptyCounts, getStrain, takeGrams, totalCount, nextLocked, seedBundles } from "./strains";
import { dealerStats, finishTraining, trainingCost, trainingSeconds } from "./training";
import type { Dealer, GameState, GardenerMode, Pot, SkillId, StaffMember, StaffRole, StrainId } from "./types";

export type GameAction =
    | { type: 'plant'; potId: number; strain: StrainId; now: number }
    | { type: 'harvest'; potId: number; now: number }
    | { type: 'sell'; grams: number }
    | { type: 'clickPot'; potId: number; now: number }
    | { type: 'buyPot' }
    | { type: 'hireDealer'; candidateIndex: number }
    | { type: 'sendDealer'; dealerId: number; grams: number; now: number }
    | { type: 'tick'; now: number }
    | { type: 'devSet'; cash: number; strain: StrainId; grams: number }
    | { type: 'devRipenPots'; now: number }
    | { type: 'buySeeds'; strain: StrainId; bundleIndex: number }
    | { type: 'hireStaff'; role: StaffRole; now: number }
    | { type: 'toggleStaff'; role: StaffRole }
    | { type: 'setMinStash'; grams: number }
    | { type: 'setFullLoadsOnly'; value: boolean }
    | { type: 'buildDock' }
    | { type: 'orderPallet'; offerIndex: number; now: number }
    | { type: 'unloadPallet'; now: number }
    | { type: 'pickStrain'; strain: StrainId }
    | { type: 'unlockStrain'; strain: StrainId }
    | { type: 'moveStrain'; strain: StrainId; target: StrainId }
    | { type: 'setGardenerMode'; mode: GardenerMode }
    | { type: 'trainDealer'; dealerId: number; skill: SkillId; now: number }

export function createInitialState(now: number): GameState {
    const pots: Pot[] = []
    for (let index = 0; index < CONFIG.startPots; index++) {
        pots.push({ id: index + 1, plantedAt: null, strain: 'classic' })
    }
    const roller = makeRoller(now)
    return {
        cash: CONFIG.startCash,
        stash: emptyCounts(),
        seeds: { ...emptyCounts(), classic: CONFIG.startSeeds },
        plantStrain: 'classic',
        unlocked: ['classic'],
        gardenerOrder: ['classic'],
        gardenerMode: 'value',
        pots,
        dealers: [],
        candidates: rollCandidates(roller.roll, []),
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
            return plant(state, action.potId, action.now, action.strain)
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
            return {
                ...state,
                cash: Math.max(0, action.cash),
                stash: { ...state.stash, [action.strain]: Math.max(0, Math.floor(action.grams)) },
            }
        }
        case 'devRipenPots': {
            return {
                ...state,
                pots: state.pots.map((pot) => ({ ...pot, plantedAt: action.now - growSeconds(pot) * 1000 })),
            }
        }
        case "buySeeds": {
            return buySeeds(state, action.strain, action.bundleIndex)
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
        case 'pickStrain': {
            return { ...state, plantStrain: action.strain }
        }
        case 'unlockStrain': {
            return unlockStrain(state, action.strain)
        }
        case 'moveStrain': {
            return moveStrain(state, action.strain, action.target)
        }
        case 'setGardenerMode': {
            return { ...state, gardenerMode: action.mode }
        }
        case 'trainDealer': {
            return trainDealer(state, action.dealerId, action.skill, action.now)
        }
    }
}

function plant(state: GameState, potId: number, now: number, strain: StrainId): GameState {
    const pot = state.pots.find((item) => item.id === potId)
    if (pot === undefined || pot.plantedAt !== null) {
        return state
    }
    if (state.seeds[strain] < 1) {
        return state
    }
    return {
        ...state,
        seeds: { ...state.seeds, [strain]: state.seeds[strain] - 1},
        pots: updatePot(state.pots, potId, { plantedAt: now, strain}),
    }
}

function harvest(state: GameState, potId: number, now: number,): GameState {
    const pot = state.pots.find((item) => item.id === potId)
    if (pot === undefined || getStage(pot, now) !== 'ready') {
        return state
    }
    return {
        ...state,
        stash: { ...state.stash, [pot.strain]: state.stash[pot.strain] + getStrain(pot.strain).yieldGrams },
        pots: updatePot(state.pots, potId, {plantedAt: null}),
    }
}

function clickPot(state: GameState, potId: number, now: number): GameState {
    const pot = state.pots.find((item) => item.id === potId)
    if (pot === undefined) {
        return state
    }
    const stage = getStage(pot, now)
    if (stage === 'empty') {
        return plant(state, potId, now, state.plantStrain)
    }
    if (stage === 'ready') {
        return harvest(state, potId, now)
    }
    return state
}

function sell(state: GameState, grams: number): GameState {
    const sold = takeGrams(state.stash, grams)
    if (sold.grams <= 0) {
        return state
    }
    return {
        ...state,
        stash: sold.stash,
        cash: state.cash + sold.value,
    }
}

function updatePot(pots: Pot[], potId: number, changes: Partial<Pot>): Pot[] {
    return pots.map((item) => {
        if (item.id !== potId) {
            return item
        }
        return { ...item, ...changes }
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
    const newPot: Pot = { id: state.pots.length + 1, plantedAt: null, strain: 'classic' }
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
    const dealers = [...state.dealers, createDealer(state.dealers.length + 1, candidate)]
    return {
        ...state,
        cash: state.cash - cost,
        dealers,
        candidates: rollCandidates(
            roller.roll,
            dealers.map((dealer) => dealer.look),
        ),
        seed: roller.nextSeed(),
    }
}

function sendDealer(state: GameState, dealerId: number, grams: number, now: number): GameState {
    const dealer = state.dealers.find((item) => item.id === dealerId)
    if (dealer === undefined || dealer.status !== 'idle') {
        return state
    }
    const load = takeGrams(state.stash, Math.min(Math.floor(grams), dealerStats(dealer).capacity))
    if (load.grams < 1) {
        return state
    }
    return {
        ...state,
        stash: load.stash,
        dealers: state.dealers.map((item): Dealer => {
            if (item.id !== dealerId) {
                return item
            }
            return {
                ...item,
                status: 'out',
                statusSince: now,
                carrying: load.grams,
                carryingValue: load.value,
                load: load.byStrain,
            }
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
    next = runRunner(next, now)
    return finishTrainings(next, now)
}

function trainDealer(state: GameState, dealerId: number, skill: SkillId, now: number): GameState {
    const dealer = state.dealers.find((item) => item.id === dealerId)
    if (dealer === undefined || dealer.training !== null) {
        return state
    }
    const rank = dealer.skills[skill] + 1
    const cost = trainingCost(skill, rank)
    if (rank > CONFIG.training.maxRank || state.cash < cost) {
        return state
    }
    const training = { skill, rank, startedAt: now, endsAt: now + trainingSeconds(skill, rank) * 1000 }
    return {
        ...state,
        cash: state.cash - cost,
        dealers: state.dealers.map((item) => (item.id === dealerId ? { ...item, training } : item)),
    }
}

function finishTrainings(state: GameState, now: number): GameState {
    if (!state.dealers.some((dealer) => dealer.training !== null)) {
        return state
    }
    const dealers = state.dealers.map((dealer) => finishTraining(dealer, now))
    if (dealers.every((dealer, index) => dealer === state.dealers[index])) {
        return state
    }
    return { ...state, dealers }
}

function buySeeds(state: GameState, strain: StrainId, bundleIndex: number): GameState {
    const bundle = seedBundles(strain)[bundleIndex]
    if (bundle === undefined || !state.unlocked.includes(strain) || state.cash < bundle.price) {
        return state
    }
    return {
        ...state,
        cash: state.cash - bundle.price,
        seeds: { ...state.seeds, [strain]: state.seeds[strain] + bundle.amount }
    }
}

function unlockStrain(state: GameState, strain: StrainId): GameState {
    const next =  nextLocked(state.unlocked)
    if (next === undefined || next.id !== strain || state.cash < next.unlockCost) {
        return state
    }
    return {
        ...state,
        cash: state.cash - next.unlockCost,
        unlocked: [...state.unlocked, strain],
        gardenerOrder: [strain, ...state.gardenerOrder],
    }
}

function moveStrain(state: GameState, strain: StrainId, target: StrainId): GameState {
    const from = state.gardenerOrder.indexOf(strain)
    const to = state.gardenerOrder.indexOf(target)
    if (from === -1 || to === -1 || from === to) {
        return state
    }
    const order = state.gardenerOrder.filter((item) => item !== strain)
    order.splice(to, 0, strain)
    return { ...state, gardenerOrder: order }
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

function gardenerStrain(state: GameState) {
    return gardenerPick(state.gardenerMode, state.gardenerOrder, state.seeds)
}

function tendPot(state: GameState, potId: number, now: number) {
    const harvested = harvest(state, potId, now)
    const strain = gardenerStrain(harvested)
    if (strain === undefined) {
        return harvested
    }
    return plant(harvested, potId, now, strain)
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
    const empty = gardenerStrain(state) !== undefined ? state.pots.find((pot) => pot.plantedAt === null) : undefined
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
    const available = totalCount(state.stash) - state.minStash
    const idle = state.dealers.filter(
        (dealer) => dealer.status === 'idle' && (!state.fullLoadsOnly || dealerStats(dealer).capacity <= available),
    )
    if (idle.length === 0 || available < 1) {
        return state
    }
    const options = idle.map((dealer) => {
        const stats = dealerStats(dealer)
        const grams = Math.min(stats.capacity, available)
        return { dealer, grams, cash: takeGrams(state.stash, grams).value * (1 - stats.cut) }
    })
    const best = options.reduce((choice, option) => (option.cash > choice.cash ? option : choice))
    const next = sendDealer(state, best.dealer.id, best.grams, now)
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
        seeds: { ...state.seeds, classic: state.seeds.classic + amount },
        dock: { ...state.dock, order: null, lastUnload: { amount, at: now } },
    }
}
