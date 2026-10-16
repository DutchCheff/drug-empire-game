import { CONFIG } from '../game/config'
import { arrivalAt, formatClock } from '../game/dock'
import { BY_PRICE } from '../game/strains'
import { SKILL_NAMES } from '../game/training'
import type { Dealer, Dock, StrainCounts, TripResult } from '../game/types'

const SHOW_MS = 4000

type Toast = {
    key: string
    text: string
    detail?: string
    color: string
}

function loadText(load: StrainCounts) {
    return BY_PRICE.filter((strain) => load[strain.id] > 0)
        .map((strain) => `${load[strain.id]} g ${strain.name}`)
        .join(' · ')
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
            recent.push({
                key: `${dealer.id}-${dealer.lastTrip.at}`,
                detail: loadText(dealer.lastTrip.load),
                ...toastText(dealer.name, dealer.lastTrip),
            })
        }
    }
    for (const dealer of props.dealers) {
        const trained = dealer.lastTrained
        if (trained !== null && props.now - trained.at < SHOW_MS) {
            recent.push({
                key: `train-${dealer.id}-${trained.at}`,
                text: `${dealer.name} finished ${SKILL_NAMES[trained.skill]} ${trained.rank}`,
                color: 'border-leaf text-leaf',
            })
        }
    }
    recent.push(...dockToasts(props.dock, props.now))

    return (
        <div aria-live="polite" className="pointer-events-none fixed top-6 right-6 z-20 flex flex-col items-end gap-2">
            {recent.map((toast) => (
                <div
                    key={toast.key}
                    className={`animate-toast-in flex flex-col items-end rounded-lg border bg-panel px-4 py-2 shadow-lg ${toast.color}`}
                >
                    <p className="font-semibold">{toast.text}</p>
                    {toast.detail && <p className="font-mono text-xs text-muted">{toast.detail}</p>}
                </div>
            ))}
        </div>
    )
}
