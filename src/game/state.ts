import { CONFIG } from "./config";
import { makeRoller } from '../lib/random'
import { hireCost, nextPotCost } from './costs'
import { createDealer, rollCandidates, updateDealers } from './dealers'
import { getStage, GROW_SECONDS } from "./plants";
import type { Dealer, GameState, Pot } from "./types";

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
    const updated = updateDealers(state, now, roller.roll)
    if (updated === state) {
        return state
    }
    return { ...updated, seed: roller.nextSeed() }
}

function buySeeds(state: GameState, offerIndex: number):GameState {
    const offer = CONFIG.seedOffers[offerIndex]
    if (offer === undefined || state.cash < offer.price) {
        return state
    }
    return { ...state, cash: state.cash - offer.price, seedStock: state.seedStock + offer.amount}
}