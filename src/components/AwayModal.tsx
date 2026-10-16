import type { AwaySummary } from '../game/away'
import { Modal } from './Modal'

function duration(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
        return `${minutes} min`
    }
    return `${Math.floor(minutes / 60)} h ${minutes % 60} min`
}

function plural(count: number, word: string) {
    return `${count} ${word}${count === 1 ? '' : 's'}`
}

type Line = { text: string; value?: string; color?: string }

function summaryLines(summary: AwaySummary) {
    const lines: Line[] = []
    if (summary.sold > 0) {
        lines.push({ text: `${plural(summary.sold, 'trip')} sold`, value: `+$${summary.soldCash}`, color: 'text-leaf' })
    }
    if (summary.robbed > 0) {
        lines.push({ text: `${plural(summary.robbed, 'dealer')} robbed`, color: 'text-danger' })
    }
    if (summary.arrested > 0) {
        lines.push({ text: `${plural(summary.arrested, 'dealer')} arrested`, color: 'text-danger' })
    }
    if (summary.harvested > 0) {
        lines.push({ text: `Gardener harvested ${plural(summary.harvested, 'plant')}`, value: `+${summary.harvestedGrams} g` })
    }
    if (summary.loadsSent > 0) {
        lines.push({ text: `Runner sent ${plural(summary.loadsSent, 'load')}`, value: `${summary.gramsSent} g` })
    }
    if (summary.wagesPaid > 0) {
        lines.push({ text: 'Wages paid', value: `−$${summary.wagesPaid}`, color: 'text-danger' })
    }
    if (summary.plantsReady > 0) {
        lines.push({ text: `${plural(summary.plantsReady, 'plant')} ready to harvest` })
    }
    if (summary.vanWaiting) {
        lines.push({ text: 'Van waiting at the dock', value: 'unload', color: 'text-gold' })
    }
    for (const text of summary.trained) {
        lines.push({ text })
    }
    return lines
}

type AwayModalProps = {
    summary: AwaySummary
    onClose: () => void
}

export function AwayModal(props: AwayModalProps) {
    const lines = summaryLines(props.summary)
    const capped = props.summary.countedSeconds < props.summary.seconds
    const subtitle = `Gone for ${duration(props.summary.seconds)}${capped ? ` · only ${duration(props.summary.countedSeconds)} counted` : ''}`

    return (
        <Modal title="While you were away" subtitle={subtitle} size="sm" onClose={props.onClose}>
            <ul className="flex flex-col gap-1.5">
                {lines.map((line, index) => (
                    <li key={index} className="flex justify-between gap-4">
                        <span>{line.text}</span>
                        {line.value !== undefined && <span className={`font-mono ${line.color ?? 'text-paper'}`}>{line.value}</span>}
                    </li>
                ))}
                {lines.length === 0 && <li className="text-muted">Nothing happened.</li>}
            </ul>

            {props.summary.cashChange !== 0 && (
                <p className={`font-mono text-lg ${props.summary.cashChange > 0 ? 'text-gold' : 'text-danger'}`}>
                    {props.summary.cashChange > 0 ? '+' : '−'}${Math.abs(props.summary.cashChange)} cash
                </p>
            )}

            <button
                type="button"
                onClick={props.onClose}
                className="h-11 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink"
            >
                Back to work
            </button>
        </Modal>
    )
}