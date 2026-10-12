import { CONFIG } from "./config";
import type { GameState, StaffMember, StaffRole } from "./types";

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
