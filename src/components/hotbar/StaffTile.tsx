import { StaffSprite } from '../../art/staff/StaffSprite'
import { CONFIG } from '../../game/config'
import type { StaffStatus } from '../../game/staff'
import type { StaffRole } from '../../game/types'
import { STAFF_INFO, STATUS_STYLE } from './staffInfo'

type StaffTileProps = {
    role: StaffRole
    status: StaffStatus
    selected: boolean
    cash: number
    onClick: () => void
}

export function StaffTile(props: StaffTileProps) {
    const info = STAFF_INFO[props.role]
    const style = STATUS_STYLE[props.status]
    const hired = props.status !== 'none'
    const hireCost = CONFIG.staff[props.role].hireCost

    return (
        <div className="flex w-24 flex-col items-center gap-1">
            <button
                type="button"
                onClick={props.onClick}
                aria-label={hired ? `${info.name}: ${props.status}` : `Hire a ${info.name.toLowerCase()} for $${hireCost}`}
                className={`relative flex size-19 cursor-pointer items-center justify-center rounded-xl border-2 hover:bg-white/5 ${hired ? `bg-ground ${style.border}` : 'border-dashed border-muted/60'} ${props.selected ? 'ring-2 ring-paper' : ''}`}
            >
                {hired ? (
                    <svg viewBox="-17 -18 34 34" className={`size-14 ${props.status === 'working' ? '' : 'opacity-50'}`} aria-hidden="true">
                        <StaffSprite role={props.role} walking={false} />
                    </svg>
                ) : (
                    <span className="text-3xl">+</span>
                )}
            </button>
            <span className="text-sm font-semibold">{hired ? info.name : `Hire ${info.name.toLowerCase()}`}</span>
            {hired ? (
                <span className={`font-mono text-xs ${style.text}`}>{props.status}</span>
            ) : (
                <span className={`font-mono text-xs ${props.cash >= hireCost ? 'text-gold' : 'text-muted'}`}>${hireCost}</span>
            )}
        </div>
    )
}
