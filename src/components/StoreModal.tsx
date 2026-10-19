import { useState } from 'react'
import { FertilizerBagIcon, LampIcon } from '../art/gear/GearIcons.tsx'
import { CONFIG } from '../game/config'
import { lampCost } from '../game/gear'
import { nextLocked, seedBundles, STRAINS } from '../game/strains'
import type { StrainCounts, StrainId } from '../game/types'
import { Modal } from './Modal'

type StoreTab = 'seeds' | 'strains' | 'gear'

const TABS: { id: StoreTab; name: string }[] = [
    { id: 'seeds', name: 'Seeds' },
    { id: 'strains', name: 'Strains' },
    { id: 'gear', name: 'Grow gear' },
]

type StoreModalProps = {
    cash: number
    seeds: StrainCounts
    unlocked: StrainId[]
    lamps: number
    lampsPlaced: number
    potCount: number
    fertilizer: number
    onBuySeeds: (strain: StrainId, bundleIndex: number) => void
    onUnlock: (strain: StrainId) => void
    onBuyLamp: () => void
    onBuyFertilizer: (bundleIndex: number) => void
    onClose: () => void
}

export function StoreModal(props: StoreModalProps) {
    const [tab, setTab] = useState<StoreTab>('seeds')
    const next = nextLocked(props.unlocked)
    const tabClass = 'flex h-10 items-center gap-2 border-b-2 px-3.5 font-semibold'
    const buyClass =
        'h-10 w-full cursor-pointer whitespace-nowrap rounded-lg bg-leaf px-3 font-mono text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40'
    const rowClass = 'grid items-center gap-3 rounded-xl border border-edge bg-ground p-3'
    const gearRow = `${rowClass} grid-cols-[3rem_minmax(0,1fr)_repeat(3,7.5rem)]`
    const sectionTitle = 'font-mono text-xs tracking-widest text-muted uppercase'
    const nextLamp = lampCost(props.lamps)
    const lampsFull = props.lamps >= props.potCount
    const lampsAvailable = props.lamps - props.lampsPlaced

    return (
        <Modal
            title="Store"
            subtitle="Buy seeds, unlock strains and growgear"
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

            {tab === 'gear' && (
                <>
                    <section className="flex flex-col gap-2">
                        <h3 className={sectionTitle}>Grow lamps</h3>
                        <div className={gearRow}>
                            <LampIcon className="size-12" />
                            <div className="flex min-w-0 flex-col">
                                <span className="font-semibold">Grow lamp</span>
                                <span className="text-sm text-muted">
                                    Hangs over one pot: grows {CONFIG.growGear.lamp.speedUp * 100}% faster.
                                </span>
                                <span className="font-mono text-xs text-muted">
                                    {props.lamps} owned · {props.lampsPlaced} placed ·{' '}
                                    <span className={lampsAvailable > 0 ? 'text-gold' : ''}>{lampsAvailable} available</span> ·{' '}
                                    {props.potCount - props.lamps} pots without
                                </span>
                            </div>
                            {lampsFull ? (
                                <span className="col-span-3 flex flex-col items-end text-right">
                                    <span className="text-sm font-semibold">No free pots for a lamp</span>
                                    <span className="text-xs text-muted">Buy another pot to hang one more lamp.</span>
                                </span>
                            ) : (
                                <>
                                    <span className="col-span-2 text-right font-mono text-xs text-muted">
                                        then ${lampCost(props.lamps + 1)}
                                    </span>
                                    <button
                                        type="button"
                                        disabled={props.cash < nextLamp}
                                        onClick={props.onBuyLamp}
                                        className={buyClass}
                                    >
                                        1 · ${nextLamp}
                                    </button>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h3 className={sectionTitle}>Fertilizer</h3>
                        <div className={gearRow}>
                            <FertilizerBagIcon className="size-12" />
                            <div className="flex min-w-0 flex-col">
                                <span className="font-semibold">Fertilizer</span>
                                <span className="text-sm text-muted">
                                    One bag per planting: +{CONFIG.growGear.fertilizer.yieldBonus * 100}% yield.
                                </span>
                                <span className={`font-mono text-xs ${props.fertilizer === 0 ? 'text-gold' : 'text-muted'}`}>
                                    In stock: {props.fertilizer} bags
                                </span>
                            </div>
                            {CONFIG.growGear.fertilizer.bundles.map((bundle, index) => (
                                <button
                                    key={bundle.amount}
                                    type="button"
                                    disabled={props.cash < bundle.price}
                                    onClick={() => props.onBuyFertilizer(index)}
                                    className={buyClass}
                                >
                                    {bundle.amount} · ${bundle.price}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-muted">Bulk: a fertilizer pallet of 100 bags can be ordered at the loading dock.</p>
                    </section>
                </>
            )}
        </Modal>
    )
}