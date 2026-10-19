import { makeRoller } from '../lib/random'
import { pickLook } from './dealers'
import type { DealerCandidate, GameState } from "./types";
import { emptyCounts } from "./strains";
import { emptySkills } from "./training";
import { createInitialState } from "./state";

const SAVE_KEY = 'drug-empire-save'
const OLD_LOOK_COUNT = 5

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
        const dealers = loaded.dealers.map((dealer) => ({
            ...dealer,
            look: dealer.look ?? (dealer.id - 1) % OLD_LOOK_COUNT,
            carryingValue: dealer.carryingValue ?? dealer.carrying * 4,
            load: dealer.load ?? { ...emptyCounts(), classic: dealer.carrying },
            skills: { ...emptySkills(), ...dealer.skills },
            training: dealer.training ?? null,
            lastTrained: dealer.lastTrained ?? null,
            lastTrip: dealer.lastTrip === null ? null : { ...dealer.lastTrip, load: dealer.lastTrip.load ?? emptyCounts() },
        }))
        const roller = makeRoller(loaded.seed)
        const usedLooks = dealers.map((dealer) => dealer.look)
        const candidates = loaded.candidates.map((candidate): DealerCandidate => {
            if (candidate.look !== undefined) {
                return candidate
            }
            const look = pickLook(roller.roll, usedLooks)
            usedLooks.push(look)
            return { ...candidate, look }
        })
        const rolledLooks = candidates.some((candidate, index) => candidate !== loaded.candidates[index])
        return {
            ...loaded,
            seeds: { ...emptyCounts(), ...seeds },
            stash: { ...emptyCounts(), ...stash },
            gardenerOrder: parsed.gardenerOrder ?? [...loaded.unlocked].reverse(),
            pots: loaded.pots.map((pot) => ({
                ...pot,
                strain: pot.strain ?? 'classic',
                lamp: pot.lamp ?? false,
                fertilized: pot.fertilized ?? false,
            })),
            dealers,
            candidates,
            staff: loaded.staff.map((member) => ({ ...member, speedLevel: member.speedLevel ?? 0})),
            seed: rolledLooks ? roller.nextSeed() : loaded.seed,
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