import type { AwaySummary } from '../game/away'
import type { TripOutcome } from '../game/types'

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
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-6">
            <div role="dialog" aria-modal="true" aria-labelledby="away-title" className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-edge bg-panel p-6">
                <div className="flex flex-col gap-1">
                    <h2 id="away-title" className="text-xl font-bold">While you were away</h2>
                    <p className="text-muted">Gone for {duration(props.summary.seconds)}</p>
                </div>

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
            </div>
        </div>
    )
}