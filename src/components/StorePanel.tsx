import { CONFIG } from '../game/config'

type StorePanelProps = {
    cash: number
    onBuySeeds: (offerIndex: number) => void
    onClose: () => void
}

export function StorePanel(props: StorePanelProps) {
    return (
        <section className="flex w-full max-w-300 flex-col gap-3 rounded-xl border border-edge bg-panel p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Store</h2>
                <button type="button" onClick={props.onClose} className="cursor-pointer text-muted hover:text-paper">
                    Close
                </button>
            </div>
            <h3 className="font-mono text-xs tracking-widest text-muted uppercase">Seeds</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
                {CONFIG.seedOffers.map((offer, index) => (
                    <div key={offer.amount} className="flex items-center justify-between gap-3 rounded-lg border border-edge bg-ground p-3">
                        <span className="font-semibold">{offer.amount === 1 ? '1 seed' : `${offer.amount} seeds`}</span>
                        <button
                            type="button"
                            disabled={props.cash < offer.price}
                            onClick={() => props.onBuySeeds(index)}
                            className="h-10 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Buy · ${offer.price}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}