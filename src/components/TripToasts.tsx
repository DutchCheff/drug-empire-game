import type { Dealer, TripResult } from '../game/types'

const SHOW_MS = 4000

function toastText(name: string, trip: TripResult) {
    switch (trip.outcome) {
        case 'sold': {
            return { text: `${name} sold ${trip.grams} g · +$${trip.cash}`, color: 'border-leaf text-leaf' }
        }
        case 'robbed': {
            return { text: `${name} got robbed of ${trip.grams} g!`, color: 'border-danger text-danger' }
        }
        case 'arrested': {
            return { text: `${name} got arrested · ${trip.grams} g seized`, color: 'border-danger text-danger' }
        }
    }
}

type TripToastsProps = {
    dealers: Dealer[]
    now: number
}

export function TripToasts(props: TripToastsProps) {
    const recent = []
    for (const dealer of props.dealers) {
        if (dealer.lastTrip !== null && props.now - dealer.lastTrip.at < SHOW_MS) {
            recent.push({ id: dealer.id, ...toastText(dealer.name, dealer.lastTrip), at: dealer.lastTrip.at })
        }
    }

    return (
        <div aria-live="polite" className="pointer-events-none fixed top-6 right-6 z-20 flex flex-col items-end gap-2">
            {recent.map((toast) => (
                <p
                    key={`${toast.id}-${toast.at}`}
                    className={`animate-toast-in rounded-lg border bg-panel px-4 py-2 font-semibold shadow-lg ${toast.color}`}
                >
                    {toast.text}
                </p>
            ))}
        </div>
    )
}