const SLOT_COLOR = '#8E877C'

export function LockedSlot() {
    return (
        <g>
            <circle r={37} fill="rgba(0,0,0,0.12)" stroke={SLOT_COLOR} strokeWidth={2} strokeDasharray="6 6" />
            <rect x={-8} y={-3} width={16} height={13} rx={2.5} fill={SLOT_COLOR} />
            <path d="M-5 -3 V-7 A5 5 0 0 1 5 -7 V-3" stroke={SLOT_COLOR} strokeWidth={2.6} fill="none" />
        </g>
    )
}