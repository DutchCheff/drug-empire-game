import { useState } from 'react'
import { hireCost } from '../../game/costs'
import type { Dealer, DealerCandidate } from '../../game/types'
import { DealerTile } from './DealerTile'
import { HirePanel } from './HirePanel'
import { SendPanel } from './SendPanel'

type HotbarProps = {
    dealers: Dealer[]
    candidates: DealerCandidate[]
    now: number
    stash: number
    cash: number
    onSend: (dealerId: number, grams: number) => void
    onHire: (candidateIndex: number) => void
}

export function Hotbar(props: HotbarProps) {
    const [selected, setSelected] = useState<number | 'hire' | null>(null)
    const selectedDealer = props.dealers.find((dealer) => dealer.id === selected)
    const cheapestHire = Math.min(...props.candidates.map((candidate) => hireCost(candidate, props.dealers.length)))

    function toggle(next: number | 'hire') {
        setSelected(selected === next ? null : next)
    }

    return (
        <section className="flex w-full max-w-300 flex-col gap-3">
            {selectedDealer !== undefined && (
                <SendPanel
                    key={selectedDealer.id}
                    dealer={selectedDealer}
                    stash={props.stash}
                    onSend={(grams) => {
                        props.onSend(selectedDealer.id, grams)
                        setSelected(null)
                    }}
                    onClose={() => setSelected(null)}
                />
            )}
            {selected === 'hire' && (
                <HirePanel
                    candidates={props.candidates}
                    dealerCount={props.dealers.length}
                    cash={props.cash}
                    onHire={(candidateIndex) => {
                        props.onHire(candidateIndex)
                        setSelected(null)
                    }}
                    onClose={() => setSelected(null)}
                />
            )}

            <footer className="flex flex-wrap items-start justify-center gap-3 rounded-xl border border-edge bg-panel p-4">
                {props.dealers.map((dealer) => (
                    <DealerTile
                        key={dealer.id}
                        dealer={dealer}
                        now={props.now}
                        selected={selected === dealer.id}
                        onClick={() => toggle(dealer.id)}
                    />
                ))}
                <div className="flex w-24 flex-col items-center gap-1">
                    <button
                        type="button"
                        onClick={() => toggle('hire')}
                        aria-label={`Hire a dealer, from $${cheapestHire}`}
                        className={`flex size-19 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-muted/60 text-3xl hover:bg-white/5 ${selected === 'hire' ? 'ring-2 ring-paper' : ''}`}
                    >
                        +
                    </button>
                    <span className="text-sm font-semibold">Hire</span>
                    <span className={`font-mono text-xs ${props.cash >= cheapestHire ? 'text-gold' : 'text-muted'}`}>
                        from ${cheapestHire}
                    </span>
                </div>
            </footer>
        </section>
    )
}