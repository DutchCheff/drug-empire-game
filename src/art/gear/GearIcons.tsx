import { GEAR } from '../colors'

const LAMP_LEDS = [-8, -2.7, 2.7, 8]

type GearIconProps = {
    className: string
}

export function LampIcon(props: GearIconProps) {
    return (
        <svg viewBox="-20 -20 40 40" className={props.className} aria-hidden="true">
            <circle r={17} fill={GEAR.glow} />
            <rect x={-14} y={-6} width={28} height={12} rx={3} fill={GEAR.lampBody} stroke={GEAR.lampEdge} strokeWidth={1} />
            {LAMP_LEDS.map((x, index) => (
                <circle key={x} cx={x} cy={0} r={1.7} fill={index % 2 === 0 ? GEAR.ledPink : GEAR.ledWhite} />
            ))}
        </svg>
    )
}

export function FertilizerBagIcon(props: GearIconProps) {
    return (
        <svg viewBox="-20 -20 40 40" className={props.className} aria-hidden="true">
            <g transform="rotate(-6)">
                <rect x={-11} y={-14} width={24} height={30} rx={4} fill="rgba(0,0,0,0.25)" />
                <rect x={-13} y={-16} width={24} height={30} rx={4} fill={GEAR.bag} stroke={GEAR.bagEdge} strokeWidth={1} />
                <rect x={-13} y={-16} width={24} height={6} rx={3} fill={GEAR.bagTop} />
                <rect x={-8} y={-6} width={14} height={14} rx={3} fill={GEAR.bagLabel} />
                <path d="M-1 -3 V5 M-5 1 H3" stroke="#F4EFE6" strokeWidth={2.2} strokeLinecap="round" />
            </g>
        </svg>
    )
}