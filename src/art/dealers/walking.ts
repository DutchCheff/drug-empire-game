import { getTripProgress } from '../../game/dealers'
import type { Dealer } from '../../game/types'
import { DOOR_INSIDE, DOOR_OUTSIDE } from '../room/roomLayout'

type Point = { x: number; y: number }

export type Placement = {
    point: Point
    angle: number
    walking: boolean
}

const WALK_SHARE = 0.15

function walkAlong(path: Point[], along: number): Placement {
    const segments = []
    let total = 0
    for (let index = 1; index < path.length; index++) {
        const from = path[index - 1]
        const to = path[index]
        const length = Math.hypot(to.x - from.x, to.y - from.y)
        segments.push({ from, to, length })
        total += length
    }

    let distance = along * total
    for (const segment of segments) {
        if (distance <= segment.length || segment === segments[segments.length - 1]) {
            const share = segment.length === 0 ? 1 : Math.min(distance / segment.length, 1)
            const dx = segment.to.x - segment.from.x
            const dy = segment.to.y - segment.from.y
            return {
                point: { x: segment.from.x + dx * share, y: segment.from.y + dy * share },
                angle: (Math.atan2(dx, -dy) * 180) / Math.PI,
                walking: true,
            }
        }
        distance -= segment.length
    }
    return { point: path[0], angle: 0, walking: false }
}

export function dealerPlacement(dealer: Dealer, spot: Point, now: number): Placement | null {
    if (dealer.status === 'jailed') {
        return null
    }
    if (dealer.status === 'idle') {
        return { point: spot, angle: 0, walking: false }
    }
    const progress = getTripProgress(dealer, now)
    const path = [spot, DOOR_INSIDE, DOOR_OUTSIDE]
    if (progress < WALK_SHARE) {
        return walkAlong(path, progress / WALK_SHARE)
    }
    if (progress > 1 - WALK_SHARE) {
        return walkAlong([...path].reverse(), (progress - (1 - WALK_SHARE)) / WALK_SHARE)
    }
    return null
}