function SoonBadge() {
    return <span className="rounded-full border border-gold px-2 font-mono text-xs text-gold">Soon</span>
}

export function GardenerSettings() {
    const select = 'h-10 w-full cursor-not-allowed rounded-lg border border-edge bg-ground px-3 text-muted'

    return (
        <section className="flex flex-col gap-3 border-t border-edge pt-4">
            <h3 className="font-mono text-xs tracking-widest text-muted uppercase">Planting</h3>
            <label className="flex flex-col gap-1.5 text-sm">
                <span className="flex items-center justify-between">
                    Strain <SoonBadge />
                </span>
                <select disabled className={select}>
                    <option>Classic</option>
                </select>
            </label>
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
    onMinStash: (grams: number) => void
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
            <p className="text-sm text-muted">
                Everything above {props.minStash} g goes to the idle dealer who earns you the most: load × (1 − cut).
            </p>
        </section>
    )
}
