import { CONFIG } from '../game/config'
import { arrivalAt, formatClock } from '../game/dock'
import type { Dealer, Dock, TripResult } from '../game/types'

const SHOW_MS = 4000

type Toast = {
    key: string
    text: string
    color: string
}

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

function dockToasts(dock: Dock, now: number) {
    const toasts: Toast[] = []
    const order = dock.order
    if (order !== null && now - order.orderedAt < SHOW_MS) {
        const seconds = CONFIG.dock.offers[order.offerIndex].seconds
        toasts.push({ key: `van-${order.orderedAt}`, text: `Van on the way · ${formatClock(seconds)}`, color: 'border-muted text-paper' })
    }
    if (order !== null && now >= arrivalAt(order) && now - arrivalAt(order) < SHOW_MS) {
        toasts.push({ key: `dock-${order.orderedAt}`, text: 'Van at the dock · unload the pallet', color: 'border-gold text-gold' })
    }
    if (dock.lastUnload !== null && now - dock.lastUnload.at < SHOW_MS) {
        const text = `Unloaded · +${dock.lastUnload.amount} seeds`
        toasts.push({ key: `unload-${dock.lastUnload.at}`, text, color: 'border-leaf text-leaf' })
    }
    return toasts
}

type TripToastsProps = {
    dealers: Dealer[]
    dock: Dock
    now: number
}

export function TripToasts(props: TripToastsProps) {
    const recent: Toast[] = []
    for (const dealer of props.dealers) {
        if (dealer.lastTrip !== null && props.now - dealer.lastTrip.at < SHOW_MS) {
            recent.push({ key: `${dealer.id}-${dealer.lastTrip.at}`, ...toastText(dealer.name, dealer.lastTrip) })
        }
    }
    recent.push(...dockToasts(props.dock, props.now))

    return (
        <div aria-live="polite" className="pointer-events-none fixed top-6 right-6 z-20 flex flex-col items-end gap-2">
            {recent.map((toast) => (
                <p
                    key={toast.key}
                    className={`animate-toast-in rounded-lg border bg-panel px-4 py-2 font-semibold shadow-lg ${toast.color}`}
                >
                    {toast.text}
                </p>
            ))}
        </div>
    )
}
