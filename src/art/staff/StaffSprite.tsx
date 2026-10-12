import type { StaffRole } from '../../game/types'
import { DealerSprite } from '../dealers/DealerSprite'
import type { DealerLook } from '../dealers/looks'

const LOOKS: Record<StaffRole, DealerLook> = {
    gardener: {
        head: 'bucket',
        top: '#4E7A3A',
        topShade: '#3C6030',
        skin: '#D9A47A',
        shoes: '#5A3B24',
        hat: '#D9BE78',
        hatShade: '#B8964F',
    },
    runner: {
        head: 'cap',
        top: '#6E4FA8',
        topShade: '#553C86',
        skin: '#F0C6A0',
        shoes: '#E8E4DC',
        hat: '#E9B949',
        hatShade: '#B88E2A',
        stripe: '#ECE6DA',
    },
}

function WateringCan() {
    return (
        <g transform="translate(17 -15)">
            <path d="M3 -2 L11 -9" stroke="#5F87A8" strokeWidth={2.2} strokeLinecap="round" />
            <ellipse rx={6} ry={5} fill="#7FA7C9" stroke="#5F87A8" strokeWidth={1} />
            <ellipse rx={3} ry={2.4} fill="#5F87A8" />
        </g>
    )
}

function Clipboard() {
    return (
        <g transform="translate(14 -17) rotate(-12)">
            <rect x={-5.5} y={-7.5} width={11} height={15} rx={1.4} fill="#B98A55" stroke="#8E6C3E" strokeWidth={0.8} />
            <rect x={-4} y={-5} width={8} height={11} rx={0.6} fill="#F4EFE6" />
            <path d="M-2.6 -2 H2.6 M-2.6 0.5 H2.6 M-2.6 3 H1" stroke="#A59D90" strokeWidth={0.7} />
            <rect x={-2} y={-8.5} width={4} height={2.2} rx={0.6} fill="#5A5E65" />
        </g>
    )
}

type StaffSpriteProps = {
    role: StaffRole
    walking: boolean
}

export function StaffSprite(props: StaffSpriteProps) {
    return (
        <g>
            <DealerSprite look={LOOKS[props.role]} walking={props.walking} backpack={false} />
            {props.role === 'gardener' ? <WateringCan /> : <Clipboard />}
        </g>
    )
}