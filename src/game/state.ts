import { CONFIG } from "./config";
import { nextPotCost } from "./costs";
import { getStage } from "./plants";
import type { GameState, Pot } from "./types";

export type GameAction =
    | { type: 'plant'; potId: number; now: number }
    | { type: 'harvest'; potId: number; now: number }
    | { type: 'sell'; grams: number }
    | { type: 'clickPot'; potId: number; now: number }
    | { type: 'buyPot' }

export function createInitialState(now: number): GameState {
    const pots: Pot[] = []
    for (let index = 0; index < CONFIG.startPots; index++) {
        pots.push({ id: index + 1, plantedAt: null })
    }
    return {
        cash: CONFIG.startCash,
        grams: 0,
        pots,
        dealers: [],
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
    }
}

function plant(state: GameState, potId: number, now: number): GameState {
    const pot = state.pots.find((item) => item.id === potId)
    if (pot === undefined || pot.plantedAt !== null) {
        return state
    }
    if (state.cash < CONFIG.seedCost) {
        return state
    }
    return {
        ...state,
        cash: state.cash - CONFIG.seedCost,
        pots: setPlantedAt(state.pots, potId, now)
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