import { DOCK_ART, PLANT } from '../colors'
import { FanLeaf } from '../plants/Leaf'

const CRATES = [
    { x: -16, y: -13 },
    { x: 14, y: -13 },
    { x: -16, y: 11 },
    { x: 14, y: 11 },
]

const PACKETS = [
    { x: -12, y: -12, angle: 0 },
    { x: 2, y: -14, angle: 8 },
]

function SeedPacket() {
    return (
        <g>
            <rect x={-14} y={-18} width={32} height={44} rx={2.5} fill="rgba(0,0,0,0.25)" />
            <rect x={-16} y={-20} width={32} height={44} rx={2.5} fill={DOCK_ART.packet} stroke={DOCK_ART.packetEdge} strokeWidth={0.8} />
            <rect x={-16} y={-20} width={32} height={7} rx={2} fill={DOCK_ART.packetBand} />
            <FanLeaf x={0} y={12} angle={0} length={13} leaflets={5} fill={PLANT.leafMid} />
        </g>
    )
}

function SeedCrate() {
    return (
        <g>
            <rect x={-26} y={-16} width={56} height={36} rx={3} fill="rgba(0,0,0,0.25)" />
            <rect x={-28} y={-18} width={56} height={36} rx={3} fill={DOCK_ART.crate} stroke={DOCK_ART.crateShade} strokeWidth={1} />
            <path d="M-28 -6 H28 M-28 6 H28" stroke={DOCK_ART.crateSlat} strokeWidth={1} />
            {PACKETS.map((packet) => (
                <g key={packet.x} transform={`translate(${packet.x} ${packet.y}) scale(0.55) rotate(${packet.angle})`}>
                    <SeedPacket />
                </g>
            ))}
        </g>
    )
}

type PalletProps = {
    loaded: boolean
}

export function Pallet(props: PalletProps) {
    return (
        <g>
            <rect x={-29} y={-23} width={60} height={48} rx={2} fill="rgba(0,0,0,0.28)" />
            <rect x={-31} y={-25} width={60} height={48} rx={2} fill={DOCK_ART.pallet} stroke={DOCK_ART.palletShade} strokeWidth={1} />
            <path d="M-31 -9 H29 M-31 7 H29" stroke={DOCK_ART.palletShade} strokeWidth={1} />
            {props.loaded &&
                CRATES.map((crate) => (
                    <g key={`${crate.x} ${crate.y}`} transform={`translate(${crate.x} ${crate.y}) scale(0.5)`}>
                        <SeedCrate />
                    </g>
                ))}
        </g>
    )
}
