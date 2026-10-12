import { CONFIG } from './config'
import type { Dock, DockOrder } from './types'

export type DockStatus = 'locked' | 'idle' | 'onTheWay' | 'atDock'

export function arrivalAt(order: DockOrder) {
    return order.orderedAt + CONFIG.dock.offers[order.offerIndex].seconds * 1000
}

export function dockStatus(dock: Dock, now: number): DockStatus {
    if (!dock.built) {
        return 'locked'
    }
    if (dock.order === null) {
        return 'idle'
    }
    return now < arrivalAt(dock.order) ? 'onTheWay' : 'atDock'
}

export function secondsLeft(order: DockOrder, now: number) {
    return Math.max(0, Math.ceil((arrivalAt(order) - now) / 1000))
}

export function formatClock(seconds: number) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
