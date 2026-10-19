import { gardenerSeconds } from '../../game/staff';
import type { StaffMember } from '../../game/types'
import { GARDENER_HOME, POT_SLOTS, RUNNER_SPOT } from '../room/roomLayout'

type Point = { x: number; y: number }

function besidePot(potId: number | null): Point {
    if (potId === null) {
        return GARDENER_HOME
    }
    const slot = POT_SLOTS[potId - 1]
    return { x: slot.x, y: slot.y + 62 }
}

export function staffPlacement(member: StaffMember, now: number) {
    if (member.role === 'runner') {
        return { point: RUNNER_SPOT, angle: 90, walking: false }
    }
    const from = besidePot(member.potId ?? null)
    const targetPotId = member.targetPotId ?? null
    if (targetPotId === null) {
        return { point: from, angle: 0, walking: false }
    }
    const to = besidePot(targetPotId)
    const progress = Math.min((now - member.movedAt) / (gardenerSeconds(member.speedLevel).walk * 1000), 1)
    const dx = to.x - from.x
    const dy = to.y - from.y
    if (progress >= 1 || (dx === 0 && dy === 0)) {
        return { point: to, angle: 0, walking: false }
    }
    return {
        point: { x: from.x + dx * progress, y: from.y + dy * progress },
        angle: (Math.atan2(dx, -dy) * 180) / Math.PI,
        walking: true,
    }
}
