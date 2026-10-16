import { useState } from "react";
import { DealerSprite } from "../../art/dealers/DealerSprite";
import { lookFor } from "../../art/dealers/looks";
import { CONFIG } from "../../game/config";
import { formatClock } from "../../game/dock";
import {
    dealerStats,
    SKILL_IDS,
    SKILL_NAMES,
    trainedRanks,
    trainedStats,
    trainingCost,
    trainingSeconds,
    trainingShare,
    trainingTime,
} from "../../game/training";
import type { Dealer, DealerStats, SkillId } from "../../game/types";
import { percent } from "../../lib/format";
import { Modal } from "../Modal";
import { TrainingRing } from "./TrainingRing";

const COLUMNS = 'grid grid-cols-[minmax(0,1fr)_3.25rem_3.25rem_3.25rem_3.25rem_3rem_9.5rem] items-center gap-2'
const MAX_RANKS = SKILL_IDS.length * CONFIG.training.maxRank
const PIPS = Array.from({ length: CONFIG.training.maxRank }, (_, index) => index)
const PER_RANK = CONFIG.training.skills

function points(share: number) {
    return Math.round(share * 100)
}

const SKILLS: Record<SkillId, { name: string; effect: string }> = {
    strength: { name: SKILL_NAMES.strength, effect: `+${PER_RANK.strength.perRank} g carry capacity per rank` },
    stealth: { name: SKILL_NAMES.stealth, effect: `−${points(PER_RANK.stealth.perRank)}% of base arrest chance per rank` },
    streetSmarts: {
        name: SKILL_NAMES.streetSmarts,
        effect: `−${points(PER_RANK.streetSmarts.perRank)}% of base robbery chance per rank`,
    },
    loyalty: {
        name: SKILL_NAMES.loyalty,
        effect: `−${points(PER_RANK.loyalty.perRank)} points cut per rank, never below ${points(CONFIG.training.minCut)}%`,
    },
}

const STATUS: Record<Dealer['status'], { text: string; color: string }> = {
    idle: { text: 'idle', color: 'text-leaf' },
    out: { text: 'out on a trip', color: 'text-muted' },
    jailed: { text: 'in jail', color: 'text-danger' },
}

function money(value: number) {
    return `$${value.toLocaleString('en-US')}`
}

function duration(seconds: number) {
    if (seconds < 60) {
        return `${seconds} s`
    }
    if (seconds % 60 === 0) {
        return `${seconds / 60} min`
    }
    return formatClock(seconds)
}

function statChange(skill: SkillId, before: DealerStats, after: DealerStats) {
    switch (skill) {
        case 'strength': {
            return `carry ${before.capacity} g → ${after.capacity} g`
        }
        case 'stealth': {
            return `arrest ${percent(before.arrestChance)} → ${percent(after.arrestChance)}`
        }
        case 'streetSmarts': {
            return `robbery ${percent(before.robberyChance)} → ${percent(after.robberyChance)}`
        }
        case 'loyalty': {
            return `cut ${percent(before.cut)} → ${percent(after.cut)}`
        }
    }
}

function pipColor(index: number, rank: number, inTraining: boolean) {
    if (index < rank) {
        return 'bg-leaf'
    }
    if (inTraining && index === rank) {
        return 'animate-pulse bg-gold'
    }
    return 'bg-edge'
}

type PortraitProps = {
    dealer: Dealer
    className: string
}

function Portrait(props: PortraitProps) {
    return (
        <svg viewBox="-17 -18 34 34" className={props.className} aria-hidden="true">
            <DealerSprite look={lookFor(props.dealer.look)} walking={false} backpack={false} />
        </svg>
    )
}

type SkillCardProps = {
    dealer: Dealer
    skill: SkillId
    cash: number
    onTrain: () => void
}

function SkillCard(props: SkillCardProps) {
    const rank = props.dealer.skills[props.skill]
    const next = rank + 1
    const training = props.dealer.training
    const inTraining = training !== null && training.skill === props.skill
    const cost = trainingCost(props.skill, next)
    const after = trainedStats(props.dealer.stats, { ...props.dealer.skills, [props.skill]: next })
    let blocked = ''

    if (inTraining) {
        blocked = `Training rank ${next}`
    } else if (training !== null) {
        blocked = `Busy with ${SKILLS[training.skill].name}`
    } else if (props.cash < cost) {
        blocked = 'Not enough cash'
    }

    return (
        <div className="flex flex-col gap-2 rounded-lg border border-edge bg-panel p-3">
            <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{SKILLS[props.skill].name}</span>
                <span className="flex gap-1" aria-label={`Rank ${rank} of ${CONFIG.training.maxRank}`}>
                    {PIPS.map((index) => (
                        <span key={index} className={`h-2 w-4 rounded-sm ${pipColor(index, rank, inTraining)}`} />
                    ))}
                </span>
            </div>
            <span className="text-[13px] text-muted">{SKILLS[props.skill].effect}</span>
            {rank >= CONFIG.training.maxRank ? (
                <span className="font-mono text-xs text-leaf">Max rank</span>
            ) : (
                <>
                    <span className="font-mono text-xs">
                        Rank {next} · {statChange(props.skill, dealerStats(props.dealer), after)}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm text-gold">
                            {money(cost)} <span className="text-muted">· {duration(trainingSeconds(props.skill, next))}</span>
                        </span>
                        <button
                            type="button"
                            disabled={blocked !== ''}
                            onClick={props.onTrain}
                            className="h-9 cursor-pointer rounded-lg bg-leaf px-3 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Train
                        </button>
                    </div>
                    {blocked !== '' && <span className="text-xs text-muted">{blocked}</span>}
                </>
            )}
        </div>
    )
}

type CrewModalProps = {
    dealers: Dealer[]
    cash: number
    now: number
    initialDealerId: number | null
    onTrain: (dealerId: number, skill: SkillId) => void
    onHire: () => void
    onClose: () => void
}

export function CrewModal(props: CrewModalProps) {
    const [selectedId, setSelectedId] = useState(props.initialDealerId)
    const selected: Dealer | undefined = props.dealers.find((dealer) => dealer.id === selectedId) ?? props.dealers[0]
    const count = props.dealers.length
    const trainingCount = props.dealers.filter((dealer) => dealer.training !== null).length
    const subtitle =
        count === 0
            ? 'Train your dealers to carry more and get caught less'
            : `${count} dealer${count === 1 ? '' : 's'} · ${trainingCount} in training`
    
    return (
        <Modal
            title="Crew"
            subtitle={subtitle}
            size="lg"
            headerExtra={<span className="rounded-lg bg-ground px-3 py-2 font-mono">{money(props.cash)}</span>}
            onClose={props.onClose}
        >
            {selected === undefined ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-edge p-8 text-center">
                    <span className="font-semibold">No dealers yet</span>
                    <span className="text-sm text-muted">Hire a dealer first. New hires start untrained.</span>
                    <button
                        type="button"
                        onClick={props.onHire}
                        className="h-11 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink"
                    >
                        Hire a dealer
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-1.5">
                        <div className={`${COLUMNS} px-2.5 font-mono text-xs text-muted`}>
                            <span>Dealer</span>
                            <span className="text-right">Carry</span>
                            <span className="text-right">Cut</span>
                            <span className="text-right">Rob</span>
                            <span className="text-right">Arrest</span>
                            <span className="text-right">Ranks</span>
                            <span>Training</span>
                        </div>
                        <ul className="flex flex-col gap-1.5">
                            {props.dealers.map((dealer) => {
                                const stats = dealerStats(dealer)
                                const active = dealer.id === selected.id
                                return (
                                    <li key={dealer.id}>
                                        <button
                                            type="button"
                                            aria-pressed={active}
                                            onClick={() => setSelectedId(dealer.id)}
                                            className={`${COLUMNS} w-full cursor-pointer rounded-xl border bg-ground p-2.5 text-left hover:bg-white/5 ${active ? 'border-leaf' : 'border-edge'}`}
                                        >
                                            <span className="flex min-w-0 items-center gap-2.5">
                                                <Portrait dealer={dealer} className="size-9 shrink-0 rounded-lg bg-panel" />
                                                <span className="flex min-w-0 flex-col">
                                                    <span className="truncate font-semibold">{dealer.name}</span>
                                                    <span className={`font-mono text-xs ${STATUS[dealer.status].color}`}>
                                                        {STATUS[dealer.status].text}
                                                    </span>
                                                </span>
                                            </span>
                                            <span className="text-right font-mono text-sm">{stats.capacity} g</span>
                                            <span className="text-right font-mono text-sm">{percent(stats.cut)}</span>
                                            <span className="text-right font-mono text-sm">{percent(stats.robberyChance)}</span>
                                            <span className="text-right font-mono text-sm">{percent(stats.arrestChance)}</span>
                                            <span className="text-right font-mono text-sm text-muted">
                                                {trainedRanks(dealer)}/{MAX_RANKS}
                                            </span>
                                            {dealer.training === null ? (
                                                <span className="font-mono text-xs text-muted">—</span>
                                            ) : (
                                                <span className="flex min-w-0 items-center gap-2">
                                                    <TrainingRing
                                                        share={trainingShare(dealer, props.now)}
                                                        paused={dealer.status === 'jailed'}
                                                        className="size-6 shrink-0"
                                                    />
                                                    <span className="flex min-w-0 flex-col">
                                                        <span className="truncate text-xs font-semibold">
                                                            {SKILLS[dealer.training.skill].name} {dealer.training.rank}
                                                        </span>
                                                        <span
                                                            className={`font-mono text-xs ${dealer.status === 'jailed' ? 'text-muted' : 'text-gold'}`}
                                                        >
                                                            {trainingTime(dealer, props.now)}
                                                        </span>
                                                    </span>
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <section className="flex flex-col gap-3 rounded-xl border border-edge bg-ground p-4">
                        <div className="flex items-center gap-3">
                            <Portrait dealer={selected} className="size-12 shrink-0 rounded-lg border-2 border-edge bg-panel" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold">{selected.name}</span>
                                <span className="text-sm text-muted">One skill at a time · keeps working while training</span>
                            </div>
                        </div>
                        {selected.training !== null && (
                            <div
                                className={`flex flex-col gap-2 rounded-lg border p-3 ${selected.status === 'jailed' ? 'border-edge' : 'border-gold/60'}`}
                            >
                                <div className="flex items-center justify-between gap-3 text-sm">
                                    <span>
                                        Training{' '}
                                        <span className="font-semibold">
                                            {SKILLS[selected.training.skill].name} {selected.training.rank}
                                        </span>
                                    </span>
                                    <span
                                        className={`font-mono text-xs ${selected.status === 'jailed' ? 'text-muted' : 'text-gold'}`}
                                    >
                                        {trainingTime(selected, props.now)}
                                    </span>
                                </div>
                                <span className="h-1.5 rounded-full bg-white/10">
                                    <span
                                        className={`block h-1.5 rounded-full ${selected.status === 'jailed' ? 'bg-muted' : 'bg-gold'}`}
                                        style={{ width: `${trainingShare(selected, props.now) * 100}%` }}
                                    />
                                </span>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            {SKILL_IDS.map((skill) => (
                                <SkillCard
                                    key={skill}
                                    dealer={selected}
                                    skill={skill}
                                    cash={props.cash}
                                    onTrain={() => props.onTrain(selected.id, skill)}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-muted">
                            Paid up front, then it runs on a timer, also while you are away. It pauses in jail. No cancel, no
                            rush. Skills stay with the dealer for good.
                        </p>
                    </section>
                </>
            )}
        </Modal>
    )
}