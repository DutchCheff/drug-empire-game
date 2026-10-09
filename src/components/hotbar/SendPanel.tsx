import { useState } from 'react'
import type { Dealer } from '../../game/types'
import { DealerStatsList } from './DealerStatsList'

type SendPanelProps = {
    dealer: Dealer
    stash: number
    onSend: (grams: number) => void
    onClose: () => void
}

export function SendPanel(props: SendPanelProps) {
    const max = Math.min(props.dealer.stats.capacity, props.stash)
    const [amount, setAmount] = useState(max)
    const grams = Math.max(1, Math.min(amount, max))
    const stepButton = 'size-9 cursor-pointer rounded-lg border border-edge bg-ground font-semibold hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40'

    let message = ''
    if (props.dealer.status === 'out') {
        message = 'Out on a trip.'
    } else if (props.dealer.status === 'jailed') {
        message = 'In jail.'
    } else if (max < 1) {
        message = 'The stash is empty.'
    }

    return (
        <div className="flex flex-wrap items-start gap-6 rounded-xl border border-edge bg-panel p-4">
            <div className="flex w-48 flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">{props.dealer.name}</h2>
                    <button type="button" onClick={props.onClose} className="cursor-pointer text-muted hover:text-paper">
                        Close
                    </button>
                </div>
                <DealerStatsList stats={props.dealer.stats} />
            </div>

            {message !== '' ? (
                <p className="self-center text-muted">{message}</p>
            ) : (
                <div className="flex flex-col gap-3 self-center">
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
                    <button
                        type="button"
                        onClick={() => props.onSend(grams)}
                        className="h-11 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink"
                    >
                        Send {grams} g
                    </button>
                </div>
            )}
        </div>
    )
}