import { CONFIG } from "./config";
import { formatClock } from './dock'
import type { Dealer, DealerStats, SkillId, SkillRanks, Training } from "./types";

export const SKILL_IDS: SkillId[] = ['strength', 'stealth', 'streetSmarts', 'loyalty']

export const SKILL_NAMES: Record<SkillId, string> = {
    strength: 'Strength',
    stealth: 'Stealth',
    streetSmarts: 'Street smarts',
    loyalty: 'Loyalty',
}

export function emptySkills(): SkillRanks {
    return { strength: 0, stealth: 0, streetSmarts: 0, loyalty: 0 }
}

export function trainingCost(skill: SkillId, rank: number) {
    return CONFIG.training.skills[skill].cost * CONFIG.training.rankGrowth ** (rank - 1)
}

export function trainingSeconds(skill: SkillId, rank: number) {
    return CONFIG.training.skills[skill].seconds * CONFIG.training.rankGrowth ** (rank - 1)
}

export function trainedStats(base: DealerStats, skills: SkillRanks): DealerStats {
    const effect = (skill: SkillId) => CONFIG.training.skills[skill].perRank * skills[skill]
    return {
        capacity: base.capacity + effect('strength'),
        cut: Math.max(CONFIG.training.minCut, base.cut - effect('loyalty')),
        robberyChance: base.robberyChance * (1 - effect('streetSmarts')),
        arrestChance: base.arrestChance * (1 - effect('stealth')),
    }
}

export function dealerStats(dealer: Dealer) {
    return trainedStats(dealer.stats, dealer.skills)
}

export function trainingLeftMs(dealer: Dealer, now: number) {
    const training = dealer.training
    if (training === null) {
        return 0
    }
    let clock = now
    if (dealer.status === 'jailed' && dealer.statusSince !== null) {
        clock = Math.max(dealer.statusSince, training.startedAt)
    }
    return Math.max(0, training.endsAt - clock)
}

export function finishTraining(dealer: Dealer, now: number): Dealer {
    const training = dealer.training
    if (training === null || trainingLeftMs(dealer, now) > 0) {
        return dealer
    }
    return {
        ...dealer,
        skills: { ...dealer.skills, [training.skill]: training.rank },
        training: null,
        lastTrained: { skill: training.skill, rank: training.rank, at: now },
    }
}

export function resumeTraining(dealer: Dealer, releasedAt: number): Training | null {
    const training = dealer.training
    if (training === null || dealer.statusSince === null) {
        return training
    }
    const pausedFrom = Math.max(dealer.statusSince, training.startedAt)
    if (training.endsAt <= pausedFrom) {
        return training
    }
    return { ...training, endsAt: training.endsAt + releasedAt - pausedFrom }
}

export function trainingShare(dealer: Dealer, now: number) {
    const training = dealer.training
    if (training === null) {
        return 0
    }
    const total = trainingSeconds(training.skill, training.rank) * 1000
    return 1 - trainingLeftMs(dealer, now) / total
}

export function trainedRanks(dealer: Dealer) {
    return SKILL_IDS.reduce((total, skill) => total + dealer.skills[skill], 0)
}

export function trainingTime(dealer: Dealer, now: number) {
    if (dealer.status === 'jailed') {
        return 'paused · in jail'
    }
    return `${formatClock(Math.ceil(trainingLeftMs(dealer, now) / 1000))} left`
}
