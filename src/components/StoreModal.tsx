import { CONFIG } from '../game/config'
import { Modal } from './Modal'

const TABS = [
    { name: 'Seeds', ready: true },
    { name: 'Strains', ready: false },
    { name: 'Dealer gear', ready: false },
    { name: 'Grow gear', ready: false },
]

type StoreModalProps = {
    cash: number
    seedStock: number
    onBuySeeds: (offerIndex: number) => void
    onClose: () => void
}

export function StoreModal(props: StoreModalProps) {
    const singlePrice = CONFIG.seedOffers[0].price

    return (
        <Modal
            title="Store"
            subtitle="Seeds go into your stock · planting uses 1 seed"
            size="lg"
            headerExtra={<span className="rounded-lg bg-ground px-3 py-2 font-mono">${props.cash}</span>}
            onClose={props.onClose}
        >
            <div role="tablist" className="flex gap-1 border-b border-edge">
                {TABS.map((tab) => (
                    <button
                        key={tab.name}
                        type="button"
                        role="tab"
                        aria-selected={tab.ready}
                        disabled={!tab.ready}
                        className={`flex h-10 items-center gap-2 border-b-2 px-3.5 font-semibold ${tab.ready ? 'border-leaf text-paper' : 'cursor-not-allowed border-transparent text-muted'}`}
                    >
                        {tab.name}
                        {!tab.ready && (
                            <span className="rounded-full border border-gold px-2 font-mono text-xs text-gold">Soon</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs tracking-widest text-muted uppercase">Seeds · classic strain</h3>
                <span className="font-mono text-sm text-muted">
                    In stock: <span className="text-paper">{props.seedStock} seeds</span>
                </span>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
                {CONFIG.seedOffers.map((offer, index) => {
                    const each = offer.price / offer.amount
                    const saving = Math.round((1 - each / singlePrice) * 100)
                    return (
                        <div key={offer.amount} className="flex flex-col items-center gap-2.5 rounded-xl border border-edge bg-ground p-4">
                            <span className="text-lg font-semibold">{offer.amount === 1 ? '1 seed' : `${offer.amount} seeds`}</span>
                            <span className="font-mono text-xs text-muted">
                                ${each.toFixed(2)} each
                                {saving > 0 && <span className="text-leaf"> · save {saving}%</span>}
                            </span>
                            <button
                                type="button"
                                disabled={props.cash < offer.price}
                                onClick={() => props.onBuySeeds(index)}
                                className="h-11 w-full cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Buy · ${offer.price}
                            </button>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}