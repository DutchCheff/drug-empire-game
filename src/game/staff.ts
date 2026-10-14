import { CONFIG } from "./config";
import { STRAINS } from './strains'
import type { GameState, GardenerMode, StaffMember, StaffRole, Strain, StrainCounts, StrainId } from "./types";

const PAY_MS = CONFIG.staff.payEverySeconds * 1000

export function findStaff(staff: StaffMember[], role: StaffRole) {
    return staff.find((member) => member.role === role)
}

export type StaffStatus = 'none' | 'paused' | 'unpaid' | 'working'

export function staffStatus(member: StaffMember | undefined, staffPaid: boolean): StaffStatus {
    if (member === undefined) {
        return 'none'
    }
    if (!member.enabled) {
        return 'paused'
    }
    if (!staffPaid) {
        return 'unpaid'
    }
    return 'working'
}

export function wagesPerMinute(staff: StaffMember[]) {
    return staff
        .filter((member) => member.enabled)
        .reduce((total, member) => total + CONFIG.staff[member.role].wagePerMinute, 0)
}

export function payWages(state: GameState, now: number): GameState {
    if (state.staff.length === 0 || now < state.nextPayday) {
        return state
    }
    const wages = wagesPerMinute(state.staff)
    let cash = state.cash
    let paid = state.staffPaid
    let payday = state.nextPayday
    while (now >= payday) {
        paid = cash >= wages
        if (paid) {
            cash -= wages
        }
        payday += PAY_MS
    }
    return { ...state, cash, staffPaid: paid, nextPayday: payday }
}

export function profitPerSecond(strain: Strain) {
    return (strain.yieldGrams * strain.pricePerGram - strain.seedPrice) / strain.growSeconds
}

function plantsBefore(strain: Strain, choice: Strain, mode: GardenerMode) {
    if (mode === 'fastest' && strain.growSeconds !== choice.growSeconds) {
        return strain.growSeconds < choice.growSeconds
    }
    return profitPerSecond(strain) > profitPerSecond(choice)
}

export function gardenerPick(mode: GardenerMode, order: StrainId[], seeds: StrainCounts): StrainId | undefined {
    if (mode === 'order') {
        return order.find((strain) => seeds[strain] > 0)
    }
    const stocked = STRAINS.filter((strain) => seeds[strain.id] > 0)
    if (stocked.length === 0) {
        return undefined
    }
    return stocked.reduce((choice, strain) => (plantsBefore(strain, choice, mode) ? strain : choice)).id
}
