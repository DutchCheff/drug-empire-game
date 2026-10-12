import type { AwaySummary } from '../game/away'
import type { TripOutcome } from '../game/types'
import { Modal } from './Modal'

function duration(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
        return `${minutes} min`
    }
    return `${Math.floor(minutes / 60)} h ${minutes % 60} min`
}

const OUTCOME_TEXT: Record<TripOutcome, string> = {
    sold: 'sold',
    robbed: 'got robbed',
    arrested: 'got arrested',
}

type AwayModalProps = {
    summary: AwaySummary
onClose: () => void
}

export function AwayModal(props: AwayModalProps) {
    return (
        <Modal
            title="While you were away"
            subtitle={`Gone for ${duration(props.summary.seconds)}`}
            size="sm"
            onClose={props.onClose}
        >
            <ul className="flex flex-col gap-1.5">
                {props.summary.trips.map((trip, index) => (
                    <li key={index} className="flex justify-between gap-4">
                        <span>
                            {trip.name} {OUTCOME_TEXT[trip.outcome]}
                        </span>
                        {trip.outcome === 'sold' && <span className="font-mono text-leaf">+${trip.cash}</span>}
                    </li>
                ))}
                {props.summary.plantsReady > 0 && <li>{props.summary.plantsReady} plants ready to harvest</li>}
                {props.summary.trips.length === 0 && props.summary.plantsReady === 0 && (
                    <li className="text-muted">Nothing happened.</li>
                )}
            </ul>

            {props.summary.cashEarned > 0 && (
                <p className="font-mono text-lg text-gold">+${props.summary.cashEarned} earned</p>
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