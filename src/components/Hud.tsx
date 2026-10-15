import type { ReactNode } from 'react'
import { CashIcon, GramsIcon, SeedIcon, VanIcon } from '../art/icons'
import { dockStatus, formatClock, secondsLeft } from '../game/dock'
import { StoreModal } from './StoreModal'
import { STRAINS } from '../game/strains'
import type { Dock, StrainCounts, StrainId } from '../game/types'

type CounterProps = {
    label: string
    value: string
    icon: ReactNode
    onClick?: () => void
}

function Counter(props: CounterProps) {
    const className = 'flex items-center gap-2 rounded-lg bg-ground px-3 py-2 text-muted'
    const content = (
        <>
            {props.icon}
            <span className="sr-only">{props.label}</span>
            <span className="font-mono text-lg text-paper">{props.value}</span>
        </>
    )
    if (props.onClick === undefined) {
        return <div className={className}>{content}</div>
    }
    return (
        <button type="button" onClick={props.onClick} className={`${className} cursor-pointer hover:ring-2 hover:ring-edge`}>
            {content}
        </button>
    )
}

type SeedPickerProps = {
    seeds: StrainCounts
    unlocked: StrainId[]
    picked: StrainId
    onPick: (strain: StrainId) => void
}

function SeedPicker(props: SeedPickerProps) {
    return (
        <label className="flex items-center gap-2 rounded-lg bg-ground px-3 py-2 text-muted">
            <SeedIcon className="size-5" />
            <span className="sr-only">Seed to plant</span>
            <select
                value={props.picked}
                onChange={(event) => props.onPick(event.target.value as StrainId)}
                className="field-sizing-content cursor-pointer bg-ground font-mono text-lg text-paper"
            >
                {STRAINS.filter((strain) => props.unlocked.includes(strain.id)).map((strain) => (
                    <option key={strain.id} value={strain.id}>
                        {strain.name} · {props.seeds[strain.id]}
                    </option>
                ))}
            </select>
        </label>
    )
}

type DockChipProps = {
    dock: Dock
    now: number
    onUnload: () => void
}

function DockChip(props: DockChipProps) {
    const status = dockStatus(props.dock, props.now)
    if (status === 'atDock') {
        return (
            <button
                type="button"
                onClick={props.onUnload}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gold px-3 py-2 font-mono text-gold hover:bg-gold/10"
            >
                <VanIcon className="size-5" />
                Unload
            </button>
        )
    }
    if (status === 'onTheWay' && props.dock.order !== null) {
        return (
            <div className="flex items-center gap-2 rounded-lg bg-ground px-3 py-2 text-muted">
                <VanIcon className="size-5" />
                <span className="sr-only">Van arrives in</span>
                <span className="font-mono text-lg text-paper">{formatClock(secondsLeft(props.dock.order, props.now))}</span>
            </div>
        )
    }
    return null
}

type HudProps = {
    cash: number
    grams: number
    sellPrice: number
    seeds: StrainCounts
    plantStrain: StrainId
    dock: Dock
    now: number
    onSell: () => void
    unlocked: StrainId[]
    onBuySeeds: (strain: StrainId, bundleIndex: number) => void
    onUnlock: (strain: StrainId) => void
    storeOpen: boolean
    onStoreOpen: (open: boolean) => void
    onStashClick: () => void
    onUnload: () => void
    onPickStrain: (strain: StrainId) => void
}

export function Hud(props: HudProps) {
    const canSell = props.grams > 0
    const buttonClass = 'h-11 cursor-pointer rounded-lg px-4 font-semibold disabled:cursor-not-allowed disabled:opacity-40'

    return (
        <>
            <header className="flex w-full max-w-300 flex-wrap items-center justify-between gap-4 rounded-xl border border-edge bg-panel px-6 py-4">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="mr-2 text-2xl font-bold tracking-wide">DRUG EMPIRE</h1>
                    <Counter
                        label="Cash"
                        value={`$${props.cash}`}
                        icon={<CashIcon className="size-5" />}
                    />
                    <Counter
                        label="Stash"
                        value={`${props.grams} g`}
                        icon={<GramsIcon className="size-5" />}
                        onClick={props.onStashClick}
                    />
                    <SeedPicker
                        seeds={props.seeds}
                        unlocked={props.unlocked}
                        picked={props.plantStrain}
                        onPick={props.onPickStrain}
                    />
                    <DockChip
                        dock={props.dock}
                        now={props.now}
                        onUnload={props.onUnload}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => props.onStoreOpen(true)}
                        className={`${buttonClass} border border-edge bg-ground text-paper`}
                    >
                        Store
                    </button>
                    <button type="button" disabled={!canSell} onClick={props.onSell} className={`${buttonClass} bg-leaf text-ink`}>
                        Sell 1 g · ${props.sellPrice}
                    </button>
                </div>
            </header>
            {props.storeOpen && (
                <StoreModal
                    cash={props.cash}
                    seeds={props.seeds}
                    unlocked={props.unlocked}
                    onBuySeeds={props.onBuySeeds}
                    onUnlock={props.onUnlock}
                    onClose={() => props.onStoreOpen(false)}
                />
            )}
        </>
    )
}