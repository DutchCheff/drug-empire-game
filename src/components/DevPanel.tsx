import { useState } from 'react'

type DevPanelProps = {
    cash: number
    grams: number
    onSet: (cash: number, grams: number) => void
    onRipenPots: () => void
}

export function DevPanel(props: DevPanelProps) {
    const [open, setOpen] = useState(false)
    const [cash, setCash] = useState('')
    const [grams, setGrams] = useState('')
    const input = 'w-24 rounded-md border border-edge bg-ground px-2 py-1 font-mono'
    const button = 'h-9 cursor-pointer rounded-md border border-edge bg-ground px-3 font-semibold hover:bg-white/5'

    function handleToggle() {
        if (!open) {
            setCash(String(props.cash))
            setGrams(String(props.grams))
        }
        setOpen(!open)
    }

    return (
        <div className="fixed bottom-4 left-4 z-30 flex flex-col items-start gap-2">
            {open && (
                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-gold bg-panel p-4 text-sm">
                    <label className="flex items-center justify-between gap-3">
                        Cash
                        <input type="number" value={cash} onChange={(event) => setCash(event.target.value)} className={input} />
                    </label>
                    <label className="flex items-center justify-between gap-3">
                        Grams
                        <input type="number" value={grams} onChange={(event) => setGrams(event.target.value)} className={input} />
                    </label>
                    <button type="button" onClick={() => props.onSet(Number(cash), Number(grams))} className={button}>
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
