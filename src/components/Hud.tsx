import type { ReactNode } from 'react'
import { CashIcon, GramsIcon } from '../art/icons'
import { CONFIG } from '../game/config'

type CounterProps = {
    label: string
    value: string
    icon: ReactNode
}

function Counter(props: CounterProps) {
    return (
        <div className="flex items-center gap-2 rounded-lg bg-ground px-3 py-2 text-muted">
            {props.icon}
            <span className="sr-only">{props.label}</span>
            <span className="font-mono text-lg text-paper">{props.value}</span>
        </div>
    )
}

type HudProps = {
    cash: number
    grams: number
    onSell: () => void
    onSellAll: () => void
}

export function Hud(props: HudProps) {
    const canSell = props.grams > 0
    const buttonClass = 'h-11 cursor-pointer rounded-lg px-4 font-semibold disabled:cursor-not-allowed disabled:opacity-40'

    return (
        <header className="flex w-full max-w-300 flex-wrap items-center justify-between gap-4 rounded-xl border border-edge bg-panel px-6 py-4">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="mr-2 text-2xl font-bold tracking-wide">DRUG EMPIRE</h1>
                <Counter label="Cash" value={`$${props.cash}`} icon={<CashIcon className="size-5" />} />
                <Counter label="Stash" value={`${props.grams} g`} icon={<GramsIcon className="size-5" />} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <button type="button" disabled={!canSell} onClick={props.onSell} className={`${buttonClass} bg-leaf text-ink`}>
                    Sell 1 g · ${CONFIG.pricePerGram}
                </button>
                <button
                    type="button"
                    disabled={!canSell}
                    onClick={props.onSellAll}
                    className={`${buttonClass} border border-edge bg-ground text-paper`}
                >
                    Sell all · ${props.grams * CONFIG.pricePerGram}
                </button>
            </div>
        </header>
    )
}