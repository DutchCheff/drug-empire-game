import { Pallet } from '../art/dock/Pallet'
import { VanIcon } from '../art/icons'
import { CONFIG } from '../game/config'
import { dockStatus, formatClock, secondsLeft } from '../game/dock'
import type { Dock } from '../game/types'
import { Modal } from './Modal'

const SOON = [
    { name: 'Fertilizer pallet', detail: '20 bags · bigger yield', seconds: 60 },
    { name: 'Lab supplies', detail: '10 crates · for the lab', seconds: 90 },
]

type PalletThumbProps = {
    loaded: boolean
}

function PalletThumb(props: PalletThumbProps) {
    return (
        <svg viewBox="-38 -32 76 64" className="h-14 w-16 shrink-0 rounded-lg bg-floor" aria-hidden="true">
            <Pallet loaded={props.loaded} />
        </svg>
    )
}

type BulkOrderModalProps = {
    dock: Dock
    cash: number
    now: number
    onOrder: (offerIndex: number) => void
    onClose: () => void
}

export function BulkOrderModal(props: BulkOrderModalProps) {
    const status = dockStatus(props.dock, props.now)
    const order = props.dock.order
    let vanLabel = <span className="text-leaf">free</span>
    if (status === 'onTheWay' && order !== null) {
        vanLabel = <span className="text-paper">on the way · {formatClock(secondsLeft(order, props.now))}</span>
    } else if (status === 'atDock') {
        vanLabel = <span className="text-gold">at the dock</span>
    }

    return (
        <Modal
            title="Bulk order"
            subtitle="Cheaper per unit, delivered by van to the dock"
            size="md"
            headerExtra={<span className="rounded-lg bg-ground px-3 py-2 font-mono">${props.cash}</span>}
            onClose={props.onClose}
        >
            <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs tracking-widest text-muted uppercase">Pallets</h3>
                <span className="flex items-center gap-1.5 font-mono text-sm text-muted">
                    <VanIcon className="size-4" />
                    Van: {vanLabel}
                </span>
            </div>

            <ul className="flex flex-col gap-2">
                {CONFIG.dock.offers.map((offer, index) => (
                    <li key={offer.name} className="flex items-center gap-4 rounded-xl border border-edge bg-ground p-3">
                        <PalletThumb loaded />
                        <div className="flex flex-1 flex-col">
                            <span className="font-semibold">{offer.name}</span>
                            <span className="font-mono text-xs text-muted">
                                {offer.amount.toLocaleString('en-US')} seeds · ${(offer.price / offer.amount).toFixed(2)} each
                            </span>
                        </div>
                        <span className="font-mono text-sm text-muted">{offer.seconds} s</span>
                        <button
                            type="button"
                            disabled={status !== 'idle' || props.cash < offer.price}
                            onClick={() => props.onOrder(index)}
                            className="h-11 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Order · ${offer.price.toLocaleString('en-US')}
                        </button>
                    </li>
                ))}
                {SOON.map((item) => (
                    <li key={item.name} className="flex items-center gap-4 rounded-xl border border-edge bg-ground p-3 text-muted">
                        <div className="opacity-50">
                            <PalletThumb loaded={false} />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <span className="font-semibold">{item.name}</span>
                            <span className="font-mono text-xs">{item.detail}</span>
                        </div>
                        <span className="font-mono text-sm">{item.seconds} s</span>
                        <span className="rounded-full border border-gold px-2 font-mono text-xs text-gold">Soon</span>
                    </li>
                ))}
            </ul>

            <p className="text-sm text-muted">One van, one order at a time. The pallet waits at the dock until you unload it.</p>
        </Modal>
    )
}
