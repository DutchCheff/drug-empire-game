import { VAN } from '../colors'

type VanProps = {
    doorsOpen: boolean
}

export function Van(props: VanProps) {
    return (
        <g>
            <rect x={-54} y={-20} width={110} height={44} rx={8} fill="rgba(0,0,0,0.35)" />
            <rect x={-56} y={-22} width={110} height={44} rx={8} fill={VAN.body} stroke={VAN.shade} strokeWidth={1.2} />
            <rect x={26} y={-19} width={14} height={38} rx={3} fill={VAN.glass} />
            <rect x={-48} y={-16} width={66} height={32} rx={3} fill={VAN.roof} />
            <path d="M-40 -8 H8 M-40 0 H8 M-40 8 H8" stroke={VAN.rib} strokeWidth={1} />
            <rect x={40} y={-26} width={6} height={5} rx={1.5} fill={VAN.mirror} />
            <rect x={40} y={21} width={6} height={5} rx={1.5} fill={VAN.mirror} />
            {props.doorsOpen && (
                <>
                    <rect x={-79} y={-24} width={23} height={4} rx={1} fill={VAN.rib} stroke={VAN.shade} strokeWidth={0.8} />
                    <rect x={-79} y={20} width={23} height={4} rx={1} fill={VAN.rib} stroke={VAN.shade} strokeWidth={0.8} />
                    <rect x={-55} y={-18} width={8} height={36} fill={VAN.cargo} />
                </>
            )}
        </g>
    )
}
