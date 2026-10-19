import { Fragment, type ReactNode } from 'react'
import { StaffSprite } from '../../art/staff/StaffSprite'
import { CONFIG } from '../../game/config'
import type { StaffStatus } from '../../game/staff'
import type { StaffRole } from '../../game/types'
import { Modal } from '../Modal'
import { STAFF_INFO, STATUS_STYLE } from './staffInfo'

type StaffModalProps = {
    role: StaffRole
    status: StaffStatus
    rhythm: string
    cash: number
    onHire: () => void
    onToggle: () => void
    onClose: () => void
    children?: ReactNode
}

export function StaffModal(props: StaffModalProps) {
    const info = STAFF_INFO[props.role]
    const config = CONFIG.staff[props.role]
    const style = STATUS_STYLE[props.status]
    const hired = props.status !== 'none'
    const rows = [
        ['Hire', `$${config.hireCost} once`],
        ['Wage', `$${config.wagePerMinute} / min`],
        ['Pace', info.pace],
    ]

    return (
        <Modal
            title={info.name}
            subtitle={info.job}
            size="sm"
            headerExtra={
                <svg
                    viewBox="-17 -18 34 34"
                    className={`size-12 rounded-lg border-2 bg-ground ${style.border} ${hired ? '' : 'opacity-50'}`}
                    aria-hidden="true"
                >
                    <StaffSprite role={props.role} walking={false} />
                </svg>
            }
            onClose={props.onClose}
        >
            {hired ? (
                <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full border px-2.5 font-mono text-xs ${style.text} ${style.border}`}>{props.status}</span>
                    <span className="font-mono text-xs text-muted">
                        ${config.wagePerMinute} / min · {props.rhythm}
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted">Status</span>
                        <span className={`rounded-full border px-2.5 font-mono text-xs ${style.text} ${style.border}`}>not hired</span>
                    </div>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-sm">
                        {rows.map((row) => (
                            <Fragment key={row[0]}>
                                <dt className="text-muted">{row[0]}</dt>
                                <dd className="text-right font-mono">{row[1]}</dd>
                            </Fragment>
                        ))}
                    </dl>
                </>
            )}

            {props.status === 'unpaid' && (
                <p className="text-sm text-danger">Not enough cash for wages. Work resumes on the next payday you can afford.</p>
            )}

            {hired && props.children}

            {hired ? (
                <button
                    type="button"
                    onClick={props.onToggle}
                    className="h-11 cursor-pointer rounded-lg border border-edge bg-ground px-4 font-semibold text-paper"
                >
                    {props.status === 'paused' ? 'Resume' : 'Pause'}
                </button>
            ) : (
                <button
                    type="button"
                    disabled={props.cash < config.hireCost}
                    onClick={props.onHire}
                    className="h-11 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Hire · ${config.hireCost}
                </button>
            )}
        </Modal>
    )
}
