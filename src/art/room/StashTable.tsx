const GRAMS_PER_BAG = 5

const BAG_SPOTS = [
    { x: -4, y: -18, angle: -8 },
    { x: 10, y: -19, angle: 6 },
    { x: 24, y: -17, angle: -4 },
    { x: 38, y: -18, angle: 10 },
    { x: -2, y: 0, angle: 4 },
    { x: 12, y: 1, angle: -6 },
    { x: 26, y: -1, angle: 8 },
    { x: 40, y: 1, angle: -10 },
    { x: 6, y: 18, angle: -3 },
    { x: 20, y: 17, angle: 7 },
    { x: 34, y: 18, angle: -5 },
    { x: -30, y: 16, angle: 12 },
]

type BaggieProps = {
    x: number
    y: number
    angle: number
}

function Baggie(props: BaggieProps) {
    return (
        <g transform={`translate(${props.x} ${props.y}) rotate(${props.angle})`}>
            <rect x={-5.5} y={-7} width={11} height={14} rx={1.6} fill="#E9EEDD" stroke="#C9CFBC" strokeWidth={0.6} />
            <rect x={-5.5} y={-7} width={11} height={2.2} rx={0.8} fill="#D24B3F" />
            <circle cx={-1.2} cy={1.8} r={2.6} fill="#7FAE4E" />
            <circle cx={1.8} cy={2.6} r={2.2} fill="#6C9A40" />
        </g>
    )
}

type StashTableProps = {
    grams: number
}

export function StashTable(props: StashTableProps) {
    const bags = Math.min(BAG_SPOTS.length, Math.ceil(props.grams / GRAMS_PER_BAG))
    return (
        <g>
            <rect x={-46} y={-28} width={96} height={60} rx={4} fill="rgba(0,0,0,0.28)" />
            <rect x={-48} y={-30} width={96} height={60} rx={4} fill="#8A5A35" stroke="#5E3C22" strokeWidth={1.2} />
            <path d="M-48 -10 H48 M-48 10 H48" stroke="#76492A" strokeWidth={1} />
            <path d="M-45 -27 H45" stroke="#A06B42" strokeWidth={1.2} strokeLinecap="round" />
            <rect x={-42} y={-22} width={24} height={20} rx={2.5} fill="#3C3F44" stroke="#2A2C30" strokeWidth={0.8} />
            <circle cx={-30} cy={-13} r={6.5} fill="#5A5E65" />
            <rect x={-38} y={-5.5} width={16} height={3} rx={0.8} fill="#9FE07A" />
            {BAG_SPOTS.slice(0, bags).map((spot, index) => (
                <Baggie key={index} x={spot.x} y={spot.y} angle={spot.angle} />
            ))}
        </g>
    )
}