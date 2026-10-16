import { useState } from 'react'
import { DealerSprite } from '../../art/dealers/DealerSprite'
import { lookFor } from '../../art/dealers/looks'
import { takeGrams, totalCount } from '../../game/strains'
import { dealerStats, SKILL_NAMES, trainedRanks, trainingShare, trainingTime } from '../../game/training'
import type { Dealer, StrainCounts } from '../../game/types'
import { DealerStatsList } from './DealerStatsList'
import { TrainingRing } from './TrainingRing'
import { Modal } from '../Modal'

const SUBTITLES = {
    idle: 'Waiting at the stash',
    out: 'Out on a trip',
    jailed: 'In jail',
}

type SendModalProps = {
    dealer: Dealer
    stash: StrainCounts
    now: number
    onSend: (grams: number) => void
    onOpenCrew: () => void
    onClose: () => void
}

export function SendModal(props: SendModalProps) {
    const stats = dealerStats(props.dealer)
    const max = Math.min(stats.capacity, totalCount(props.stash))
    const [amount, setAmount] = useState(max)
    const grams = Math.max(1, Math.min(amount, max))
    const payout = Math.round(takeGrams(props.stash, grams).value * (1 - stats.cut))
    const stepButton = 'size-9 cursor-pointer rounded-lg border border-edge bg-ground font-semibold hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40'
    const canSend = props.dealer.status === 'idle' && max >= 1

    return (
        <Modal
            title={props.dealer.name}
            subtitle={SUBTITLES[props.dealer.status]}
            size="sm"
            headerExtra={
                <svg viewBox="-17 -18 34 34" className="size-12 rounded-lg border-2 border-edge bg-ground" aria-hidden="true">
                    <DealerSprite look={lookFor(props.dealer.look)} walking={false} backpack={false} />
                </svg>
            }
            onClose={props.onClose}
        >
            <DealerStatsList stats={stats} />
            <div className="flex items-center justify-between gap-3 rounded-lg border border-edge bg-ground px-3 py-2">
                {props.dealer.training === null ? (
                    <span className="text-sm text-muted">Not training · {trainedRanks(props.dealer)} ranks</span>
                ) : (
                    <span className="flex items-center gap-2 text-sm">
                        <TrainingRing
                            share={trainingShare(props.dealer, props.now)}
                            paused={props.dealer.status === 'jailed'}
                            className="size-6"
                        />
                        <span>
                            {SKILL_NAMES[props.dealer.training.skill]} {props.dealer.training.rank}{' '}
                            <span
                                className={`font-mono text-xs ${props.dealer.status === 'jailed' ? 'text-muted' : 'text-gold'}`}
                            >
                                · {trainingTime(props.dealer, props.now)}
                            </span>
                        </span>
                    </span>
                )}
                <button
                    type="button"
                    onClick={props.onOpenCrew}
                    className="cursor-pointer text-sm font-semibold text-leaf hover:underline"
                >
                    {props.dealer.training === null ? 'Train ›' : 'Crew ›'}
                </button>
            </div>

            {props.dealer.status === 'idle' && max < 1 && <p className="text-muted">The stash is empty.</p>}

            {canSend && (
                <>
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <button type="button" disabled={grams <= 1} onClick={() => setAmount(grams - 1)} className={stepButton}>
                                −
                            </button>
                            <span className="w-14 text-center font-mono text-lg">{grams} g</span>
                            <button type="button" disabled={grams >= max} onClick={() => setAmount(grams + 1)} className={stepButton}>
                                +
                            </button>
                            <button type="button" disabled={grams >= max} onClick={() => setAmount(max)} className={`${stepButton} w-auto px-3`}>
                                Max
                            </button>
                        </div>
                        <span className="font-mono text-sm text-muted">
                            you get ~<span className="text-gold">${payout}</span>
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => props.onSend(grams)}
                        className="h-11 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink"
                    >
                        Send {grams} g
                    </button>
                </>
            )}
        </Modal>
    )
}