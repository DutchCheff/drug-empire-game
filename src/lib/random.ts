export function seededRandom(seed: number) {
    let state = seed
    return () => {
        state = (state + 0x6d2b79f5) | 0
        let mixed = Math.imul(state ^ (state >>> 15), 1 | state)
        mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed
        return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
    }
}

// Random rolls for game rules. The seed lives in the save, so a refresh
// can't reroll a result, and the reducer stays pure.
export function makeRoller(seed: number) {
    const random = seededRandom(seed)
    return {
        roll: random,
        nextSeed: () => Math.floor(random() * 4294967296),
    }
}

export function between(roll: () => number, min: number, max: number) {
    return min + roll() * (max - min)
}

export function wholeBetween(roll: () => number, min: number, max: number) {
    return Math.floor(min + roll() * (max - min + 1))
}