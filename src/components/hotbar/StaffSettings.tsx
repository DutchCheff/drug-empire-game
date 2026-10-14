import { getStrain } from "../../game/strains"
import type { StrainCounts, StrainId } from "../../game/types"

function SoonBadge() {
    return <span className="rounded-full border border-gold px-2 font-mono text-xs text-gold">Soon</span>
}

type GardenerSettingsProps = {
    order: StrainId[]
    seeds: StrainCounts
    onMove: (strain: StrainId, direction: -1 | 1) => void
}

export function GardenerSettings(props: GardenerSettingsProps) {
    const select = 'h-10 w-full cursor-not-allowed rounded-lg border border-edge bg-ground px-3 text-muted'
    const moveButton =
        'size-8 cursor-pointer rounded-md border border-edge bg-panel hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40'

    return (
        <section className="flex flex-col gap-3 border-t border-edge pt-4">
            <h3 className="font-mono text-xs tracking-widest text-muted uppercase">Planting</h3>
            <div className="flex flex-col gap-1.5 text-sm">
                <span>Seed priority · high to low</span>
                <ol className="flex flex-col gap-1.5">
                    {props.order.map((strain, index) => {
                        const name = getStrain(strain).name
                        return (
                            <li key={strain} className="flex items-center gap-2 rounded-lg border border-edge bg-ground px-3 py-1.5">
                                <span className="w-5 font-mono text-muted">{index + 1}</span>
                                <span className="flex-1">{name}</span>
                                <span className="font-mono text-xs text-muted">{props.seeds[strain]} seeds</span>
                                <button
                                    type="button"
                                    aria-label={`Move ${name} up`}
                                    disabled={index === 0}
                                    onClick={() => props.onMove(strain, -1)}
                                    className={moveButton}
                                >
                                    ↑
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Move ${name} down`}
                                    disabled={index === props.order.length - 1}
                                    onClick={() => props.onMove(strain, 1)}
                                    className={moveButton}
                                >
                                    ↓
                                </button>
                            </li>
                        )
                    })}
                </ol>
                <p className="text-muted">He plants the highest strain that has seeds in stock.</p>
            </div>
            <label className="flex flex-col gap-1.5 text-sm">
                <span className="flex items-center justify-between">
                    Fertilizer <SoonBadge />
                </span>
                <select disabled className={select}>
                    <option>None</option>
                </select>
            </label>
        </section>
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
