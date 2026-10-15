import { useState } from 'react'
import { nextLocked, seedBundles, STRAINS } from '../game/strains'
import type { StrainCounts, StrainId } from '../game/types'
import { Modal } from './Modal'

type StoreTab = 'seeds' | 'strains'

const TABS: { id: StoreTab; name: string }[] = [
    { id: 'seeds', name: 'Seeds' },
    { id: 'strains', name: 'Strains' },
]

const SOON_TABS = ['Dealer gear', 'Grow gear']

type StoreModalProps = {
    cash: number
    seeds: StrainCounts
    unlocked: StrainId[]
    onBuySeeds: (strain: StrainId, bundleIndex: number) => void
    onUnlock: (strain: StrainId) => void
    onClose: () => void
}

export function StoreModal(props: StoreModalProps) {
    const [tab, setTab] = useState<StoreTab>('seeds')
    const next = nextLocked(props.unlocked)
    const tabClass = 'flex h-10 items-center gap-2 border-b-2 px-3.5 font-semibold'
    const buyClass =
        'h-10 w-full cursor-pointer whitespace-nowrap rounded-lg bg-leaf px-3 font-mono text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40'
    const rowClass = 'grid items-center gap-3 rounded-xl border border-edge bg-ground p-3'

    return (
        <Modal
            title="Store"
            subtitle="Buy seeds and unlock new strains"
            size="lg"
            headerExtra={<span className="rounded-lg bg-ground px-3 py-2 font-mono">${props.cash}</span>}
            onClose={props.onClose}
        >
            <div role="tablist" className="flex gap-1 border-b border-edge">
                {TABS.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={tab === item.id}
                        onClick={() => setTab(item.id)}
                        className={`${tabClass} cursor-pointer ${tab === item.id ? 'border-leaf text-paper' : 'border-transparent text-muted hover:text-paper'}`}
                    >
                        {item.name}
                    </button>
                ))}
                {SOON_TABS.map((name) => (
                    <button
                        key={name}
                        type="button"
                        role="tab"
                        aria-selected={false}
                        disabled
                        className={`${tabClass} cursor-not-allowed border-transparent text-muted`}
                    >
                        {name}
                        <span className="rounded-full border border-gold px-2 font-mono text-xs text-gold">Soon</span>
                    </button>
                ))}
            </div>

            {tab === 'seeds' && (
                <ul className="flex flex-col gap-2">
                    {STRAINS.filter((strain) => props.unlocked.includes(strain.id)).map((strain) => (
                        <li key={strain.id} className={`${rowClass} grid-cols-[minmax(0,1fr)_repeat(3,7.5rem)]`}>
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate font-semibold">{strain.name}</span>
                                <span className="font-mono text-xs text-muted">In stock: {props.seeds[strain.id]}</span>
                            </div>
                            {seedBundles(strain.id).map((bundle, index) => (
                                <button
                                    key={bundle.amount}
                                    type="button"
                                    disabled={props.cash < bundle.price}
                                    onClick={() => props.onBuySeeds(strain.id, index)}
                                    className={buyClass}
                                >
                                    {bundle.amount} · ${bundle.price}
                                </button>
                            ))}
                        </li>
                    ))}
                </ul>
            )}

            {tab === 'strains' && (
                <ul className="flex flex-col gap-2">
                    {STRAINS.map((strain) => {
                        const owned = props.unlocked.includes(strain.id)
                        const cost = `$${strain.unlockCost.toLocaleString('en-US')}`
                        return (
                            <li key={strain.id} className={`${rowClass} grid-cols-[minmax(0,1fr)_14rem_10rem]`}>
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate font-semibold">
                                        {strain.name}
                                        {strain.kind !== null && (
                                            <span className="ml-2 font-mono text-xs font-normal text-muted">{strain.kind}</span>
                                        )}
                                    </span>
                                    <span className="truncate text-sm text-muted">{strain.role}</span>
                                </div>
                                <span className="font-mono text-xs text-muted">
                                    {strain.growSeconds} s · {strain.yieldGrams} g · ${strain.pricePerGram}/g · seed ${strain.seedPrice}
                                </span>
                                {owned && <span className="text-right font-mono text-sm text-leaf">Unlocked</span>}
                                {!owned && next?.id === strain.id && (
                                    <button
                                        type="button"
                                        disabled={props.cash < strain.unlockCost}
                                        onClick={() => props.onUnlock(strain.id)}
                                        className={buyClass}
                                    >
                                        Unlock · {cost}
                                    </button>
                                )}
                                {!owned && next?.id !== strain.id && (
                                    <span className="text-right font-mono text-sm text-muted">{cost}</span>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </Modal>
    )
}