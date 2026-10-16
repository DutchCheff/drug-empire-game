import { useState } from 'react'
import { STRAINS } from '../game/strains'
import type { StrainCounts, StrainId } from '../game/types'

type DevPanelProps = {
    cash: number
    stash: StrainCounts
    unlocked: StrainId[]
    onSet: (cash: number, strain: StrainId, grams: number) => void
    onRipenPots: () => void
}

export function DevPanel(props: DevPanelProps) {
    const [open, setOpen] = useState(false)
    const [cash, setCash] = useState<string | null>(null)
    const [strain, setStrain] = useState<StrainId>('classic')
    const [grams, setGrams] = useState<string | null>(null)
    const input = 'w-24 rounded-md border border-edge bg-ground px-2 py-1 font-mono'
    const button = 'h-9 cursor-pointer rounded-md border border-edge bg-ground px-3 font-semibold hover:bg-white/5'

    function handleToggle() {
        setCash(null)
        setGrams(null)
        setOpen(!open)
    }

    function handleStrain(next: StrainId) {
        setStrain(next)
        setGrams(null)
    }

    function handleApply() {
        props.onSet(
            cash === null ? props.cash : Number(cash),
            strain,
            grams === null ? props.stash[strain] : Number(grams),
        )
        setCash(null)
        setGrams(null)
    }

    return (
        <div className="fixed bottom-4 left-4 z-30 flex flex-col items-start gap-2">
            {open && (
                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gold bg-panel p-4 text-sm">
                    <label className="flex items-center justify-between gap-3">
                        Cash
                        <input
                            type="number"
                            value={cash ?? String(props.cash)}
                            onChange={(event) => setCash(event.target.value)}
                            className={input}
                        />
                    </label>
                    <div className="flex items-center justify-between gap-3">
                        <span>Grams</span>
                        <select
                            aria-label="Strain"
                            value={strain}
                            onChange={(event) => handleStrain(event.target.value as StrainId)}
                            className="cursor-pointer rounded-md border border-edge bg-ground px-2 py-1"
                        >
                            {STRAINS.filter((item) => props.unlocked.includes(item.id)).map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            aria-label="Grams"
                            value={grams ?? String(props.stash[strain])}
                            onChange={(event) => setGrams(event.target.value)}
                            className={input}
                        />
                    </div>
                    <button type="button" onClick={handleApply} className={button}>
                        Apply
                    </button>
                    <button type="button" onClick={props.onRipenPots} className={button}>
                        Ripen all pots
                    </button>
                </div>
            )}
            <button
                type="button"
                onClick={handleToggle}
                className="cursor-pointer rounded-md border border-dashed border-gold bg-panel px-2 py-1 font-mono text-xs text-gold"
            >
                DEV
            </button>
        </div>
    )
}
