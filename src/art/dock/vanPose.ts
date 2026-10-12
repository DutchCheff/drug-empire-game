import { arrivalAt } from '../../game/dock'
import type { Dock } from '../../game/types'
import { DOCK } from '../room/roomLayout'

type Pose = { x: number; y: number; angle: number }

export type VanPlacement = Pose & { parked: boolean }

const DRIVE_MS = 4000

const PARKED: Pose = { ...DOCK.van, angle: 360 }

const DRIVE_IN: Pose[] = [{ x: 1300, y: 578, angle: 180 }, { x: 1150, y: 578, angle: 180 }, PARKED]

const DRIVE_OUT: Pose[] = [PARKED, { x: 1150, y: 530, angle: 410 }, { x: 1300, y: 578, angle: 360 }]

function along(path: Pose[], progress: number): Pose {
    const scaled = Math.min(Math.max(progress, 0), 1) * (path.length - 1)
    const index = Math.min(Math.floor(scaled), path.length - 2)
    const share = scaled - index
    const from = path[index]
    const to = path[index + 1]
    return {
        x: from.x + (to.x - from.x) * share,
        y: from.y + (to.y - from.y) * share,
        angle: from.angle + (to.angle - from.angle) * share,
    }
}

export function vanPlacement(dock: Dock, now: number): VanPlacement | null {
    if (dock.order !== null) {
        const left = arrivalAt(dock.order) - now
        if (left <= 0) {
            return { ...PARKED, parked: true }
        }
        if (left < DRIVE_MS) {
            return { ...along(DRIVE_IN, 1 - left / DRIVE_MS), parked: false }
        }
        return null
    }
    if (dock.lastUnload !== null && now - dock.lastUnload.at < DRIVE_MS) {
        return { ...along(DRIVE_OUT, (now - dock.lastUnload.at) / DRIVE_MS), parked: false }
    }
    return null
}
