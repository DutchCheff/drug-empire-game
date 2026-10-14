import { useState } from 'react'
import { SeedPacket } from '../../art/plants/SeedPacket'
import { gardenerPick } from '../../game/staff'
import { getStrain } from '../../game/strains'
import type { GardenerMode, StrainCounts, StrainId } from '../../game/types'

function SoonBadge() {
    return <span className="rounded-full border border-gold px-2 font-mono text-xs text-gold">Soon</span>
}

const MODES: { id: GardenerMode; name: string; hint: string }[] = [
    { id: 'value', name: 'Best value', hint: 'Plants the strain with seeds that earns the most per pot per minute.' },
    { id: 'fastest', name: 'Fastest', hint: 'Plants the strain with seeds that grows fastest. Good while you click along.' },
    { id: 'order', name: 'My order', hint: 'Plants the first strain in your list that has seeds.' },
]

type PacketIconProps = {
    strain: StrainId
    className: string
}

function PacketIcon(props: PacketIconProps) {
    return (
        <svg viewBox="-24 -26 48 54" className={props.className} aria-hidden="true">
            <SeedPacket strain={props.strain} />
        </svg>
    )
}

function TopIcon() {
    return (
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path
                d="M3 2.5 H13 M8 13.5 V6 M4.5 9.5 L8 6 L11.5 9.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

const GRIP_DOTS = [
    [3, 3],
    [7, 3],
    [3, 8],
    [7, 8],
    [3, 13],
    [7, 13],
]

function GripIcon() {
    return (
        <svg viewBox="0 0 10 16" className="h-4 w-2.5" aria-hidden="true">
            {GRIP_DOTS.map((dot) => (
                <circle key={`${dot[0]} ${dot[1]}`} cx={dot[0]} cy={dot[1]} r={1.4} fill="currentColor" />
            ))}
        </svg>
    )
}

type PlantsNextProps = {
    strain: StrainId
    seeds: number
}

function PlantsNext(props: PlantsNextProps) {
    const strain = getStrain(props.strain)
    return (
        <div className="flex items-center gap-3 rounded-xl border border-leaf bg-ground px-3.5 py-3">
            <PacketIcon strain={props.strain} className="size-10 shrink-0" />
            <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[11px] tracking-widest text-muted uppercase">Plants next</span>
                <span className="text-lg font-bold">{strain.name}</span>
                <span className="font-mono text-xs text-muted">
                    {props.seeds} seeds · {strain.growSeconds} s · ${strain.yieldGrams * strain.pricePerGram} per pot
                </span>
            </div>
        </div>
    )
}

type NoSeedsProps = {
    onOpenStore: () => void
}

function NoSeeds(props: NoSeedsProps) {
    return (
        <div className="flex flex-col gap-2.5 rounded-xl border border-gold bg-ground p-3.5">
            <span className="font-bold text-gold">No seeds in stock</span>
            <span className="text-sm text-muted">He keeps harvesting, but empty pots stay empty until you buy seeds.</span>
            <button
                type="button"
                onClick={props.onOpenStore}
                className="h-11 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink"
            >
                Open store
            </button>
        </div>
    )
}

type PriorityListProps = {
    order: StrainId[]
    seeds: StrainCounts
    onMove: (strain: StrainId, target: StrainId) => void
}

function PriorityList(props: PriorityListProps) {
    const [showSkipped, setShowSkipped] = useState(false)
    const [dragged, setDragged] = useState<StrainId | null>(null)
    const stocked = props.order.filter((strain) => props.seeds[strain] > 0)
    const skipped = props.order.filter((strain) => props.seeds[strain] === 0)
    const row = 'grid h-11 grid-cols-[16px_26px_1fr_auto_32px_10px] items-center gap-2 rounded-lg border bg-ground pr-2 pl-2.5'

    function handleDrop(target: StrainId) {
        if (dragged !== null) {
            props.onMove(dragged, target)
        }
        setDragged(null)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">Seed priority</span>
                <span className="flex items-center gap-1 text-xs text-muted">
                    drag, or <TopIcon /> to put first
                </span>
            </div>
            <ol className="flex flex-col gap-1.5">
                {stocked.map((strain, index) => {
                    const name = getStrain(strain).name
                    return (
                        <li
                            key={strain}
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.effectAllowed = 'move'
                                setDragged(strain)
                            }}
                            onDragOver={(event) => {
                                if (dragged !== null) {
                                    event.preventDefault()
                                }
                            }}
                            onDrop={(event) => {
                                event.preventDefault()
                                handleDrop(strain)
                            }}
                            onDragEnd={() => setDragged(null)}
                            className={`${row} ${index === 0 ? 'border-leaf' : 'border-edge'} ${dragged === strain ? 'opacity-50' : ''}`}
                        >
                            <span className="font-mono text-xs text-muted">{index + 1}</span>
                            <PacketIcon strain={strain} className="size-6" />
                            <span className="text-sm">{name}</span>
                            <span className="font-mono text-xs">{props.seeds[strain]}</span>
                            {index === 0 ? (
                                <span />
                            ) : (
                                <button
                                    type="button"
                                    aria-label={`Plant ${name} first`}
                                    onClick={() => props.onMove(strain, props.order[0])}
                                    className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-edge bg-panel hover:bg-white/5"
                                >
                                    <TopIcon />
                                </button>
                            )}
                            <span className="flex cursor-grab text-muted">
                                <GripIcon />
                            </span>
                        </li>
                    )
                })}
            </ol>
            {skipped.length > 0 && (
                <button
                    type="button"
                    aria-expanded={showSkipped}
                    onClick={() => setShowSkipped(!showSkipped)}
                    className="flex h-10 cursor-pointer items-center justify-between rounded-lg border border-dashed border-edge px-3 text-[13px] text-muted hover:text-paper"
                >
                    <span>{skipped.length} without seeds · skipped</span>
                    <span className="flex items-center gap-1">
                        {showSkipped ? 'Hide' : 'Show'}
                        <svg viewBox="0 0 16 16" className={`size-3.5 ${showSkipped ? 'rotate-180' : ''}`} aria-hidden="true">
                            <path
                                d="M4 6 L8 10 L12 6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                </button>
            )}
            {showSkipped && (
                <ol className="flex flex-col gap-1.5">
                    {skipped.map((strain) => (
                        <li key={strain} className={`${row} border-edge opacity-50`}>
                            <span className="font-mono text-xs text-muted">–</span>
                            <PacketIcon strain={strain} className="size-6" />
                            <span className="text-sm">{getStrain(strain).name}</span>
                            <span className="font-mono text-xs text-muted">0</span>
                            <span />
                            <span className="flex text-muted">
                                <GripIcon />
                            </span>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    )
}

type GardenerSettingsProps = {
    mode: GardenerMode
    order: StrainId[]
    seeds: StrainCounts
    unlocked: StrainId[]
    onMode: (mode: GardenerMode) => void
    onMove: (strain: StrainId, target: StrainId) => void
    onOpenStore: () => void
}

export function GardenerSettings(props: GardenerSettingsProps) {
    const next = gardenerPick(props.mode, props.order, props.seeds)
    const canChoose = props.unlocked.length > 1
    const showList = canChoose && props.mode === 'order'
    const hint = MODES.find((mode) => mode.id === props.mode)?.hint

    return (
        <>
            {canChoose && (
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold">What to plant</span>
                    <div role="radiogroup" aria-label="What to plant" className="grid grid-cols-3 gap-1 rounded-[10px] bg-ground p-1">
                        {MODES.map((mode) => (
                            <button
                                key={mode.id}
                                type="button"
                                role="radio"
                                aria-checked={props.mode === mode.id}
                                onClick={() => props.onMode(mode.id)}
                                className={`h-10 cursor-pointer rounded-[7px] text-sm font-semibold ${props.mode === mode.id ? 'bg-leaf text-ink' : 'text-muted hover:text-paper'}`}
                            >
                                {mode.name}
                            </button>
                        ))}
                    </div>
                    <span className="text-[13px] text-muted">{hint}</span>
                </div>
            )}
            {next === undefined && <NoSeeds onOpenStore={props.onOpenStore} />}
            {next !== undefined && showList && <PriorityList order={props.order} seeds={props.seeds} onMove={props.onMove} />}
            {next !== undefined && !showList && <PlantsNext strain={next} seeds={props.seeds[next]} />}
            {next !== undefined && !canChoose && (
                <p className="text-[13px] text-muted">Unlock more strains in the store to choose what he plants first.</p>
            )}
            <div className="flex items-center justify-between text-sm text-muted">
                <span>Fertilizer</span>
                <SoonBadge />
            </div>
        </>
    )
}

type RunnerSettingsProps = {
    minStash: number
    fullLoadsOnly: boolean
    onMinStash: (grams: number) => void
    onFullLoadsOnly: (value: boolean) => void
}

export function RunnerSettings(props: RunnerSettingsProps) {
    return (
        <section className="flex flex-col gap-3 border-t border-edge pt-4">
            <h3 className="font-mono text-xs tracking-widest text-muted uppercase">Hand-off</h3>
            <label className="flex flex-col gap-2 text-sm">
                <span className="flex justify-between">
                    <span>Keep in stash</span>
                    <span className="font-mono">{props.minStash} g</span>
                </span>
                <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={props.minStash}
                    onChange={(event) => props.onMinStash(Number(event.target.value))}
                    className="accent-leaf"
                />
            </label>
            <div className="flex items-center justify-between gap-3 text-sm">
                <span id="full-loads-label">Full loads only</span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={props.fullLoadsOnly}
                    aria-labelledby="full-loads-label"
                    onClick={() => props.onFullLoadsOnly(!props.fullLoadsOnly)}
                    className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${props.fullLoadsOnly ? 'bg-leaf' : 'bg-edge'}`}
                >
                    <span
                        className={`absolute top-0.75 size-4.5 rounded-full transition-[left] ${props.fullLoadsOnly ? 'left-5.75 bg-ink' : 'left-0.75 bg-muted'}`}
                    />
                </button>
            </div>
            <p className="text-sm text-muted">
                {props.fullLoadsOnly
                    ? `A dealer only goes out when there is a full load for them above ${props.minStash} g.`
                    : `Everything above ${props.minStash} g goes out, even if a dealer can't be filled.`}{' '}
                The idle dealer who earns you the most goes first: load × (1 − cut).
            </p>
        </section>
    )
}
