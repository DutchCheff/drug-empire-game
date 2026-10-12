import { useState } from 'react'
import { DealerSprite } from '../../art/dealers/DealerSprite'
import { lookFor } from '../../art/dealers/looks'
import { CONFIG } from '../../game/config'
import type { Dealer } from '../../game/types'
import { Modal } from '../Modal'
import { DealerStatsList } from './DealerStatsList'

const SUBTITLES = {
    idle: 'Waiting at the stash',
    out: 'Out on a trip',
    jailed: 'In jail',
}

type SendModalProps = {
    dealer: Dealer
    stash: number
    onSend: (grams: number) => void
    onClose: () => void
}

export function SendModal(props: SendModalProps) {
    const max = Math.min(props.dealer.stats.capacity, props.stash)
    const [amount, setAmount] = useState(max)
    const grams = Math.max(1, Math.min(amount, max))
    const payout = Math.round(grams * CONFIG.pricePerGram * (1 - props.dealer.stats.cut))
    const stepButton = 'size-9 cursor-pointer rounded-lg border border-edge bg-ground font-semibold hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40'
    const canSend = props.dealer.status === 'idle' && max >= 1

    return (
        <Modal
            title={props.dealer.name}
            subtitle={SUBTITLES[props.dealer.status]}
            size="sm"
            headerExtra={
                <svg viewBox="-17 -18 34 34" className="size-12 rounded-lg border-2 border-edge bg-ground" aria-hidden="true">
                    <DealerSprite look={lookFor(props.dealer.id)} walking={false} backpack={false} />
                </svg>
            }
            onClose={props.onClose}
        >
            <DealerStatsList stats={props.dealer.stats} />

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