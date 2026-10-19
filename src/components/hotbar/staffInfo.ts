import type { StaffStatus } from '../../game/staff'
import type { StaffRole } from '../../game/types'

export const STAFF_INFO: Record<StaffRole, { name: string; job: string; pace: string }> = {
    gardener: { name: 'Gardener', job: 'Plants empty pots and harvests ripe plants.', pace: 'walks 1.2 s · tends 2 s' },
    runner: { name: 'Runner', job: 'Hands product to the idle dealer who earns you the most.', pace: 'checks every 1 s' },
}

export const STATUS_STYLE: Record<StaffStatus, { text: string; border: string }> = {
    none: { text: 'text-muted', border: 'border-edge' },
    paused: { text: 'text-muted', border: 'border-edge' },
    unpaid: { text: 'text-danger', border: 'border-danger' },
    working: { text: 'text-leaf', border: 'border-leaf' },
}
