import type { StrainId } from '../../game/types'
import { DOCK_ART } from '../colors'
import { FanLeaf } from './Leaf'
import { STRAIN_LOOKS } from './strainLooks'

type SeedPacketProps = {
    strain: StrainId
}

export function SeedPacket(props: SeedPacketProps) {
    const look = STRAIN_LOOKS[props.strain]
    return (
        <g>
            <rect x={-14} y={-18} width={32} height={44} rx={2.5} fill="rgba(0,0,0,0.25)" />
            <rect
                x={-16}
                y={-20}
                width={32}
                height={44}
                rx={2.5}
                fill={DOCK_ART.packet}
                stroke={DOCK_ART.packetEdge}
                strokeWidth={0.8}
            />
            <rect x={-16} y={-20} width={32} height={7} rx={2} fill={look.packet} />
            <FanLeaf
                x={0}
                y={12}
                angle={0}
                length={14}
                leaflets={look.leaflets}
                fill={look.leafMid}
                width={look.leafWidth}
                rib={look.rib}
            />
        </g>
    )
}
