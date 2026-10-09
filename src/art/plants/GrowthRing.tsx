const RADIUS = 47
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type GrowthRingProps = {
    progress: number
    color: string
}

export function GrowthRing(props: GrowthRingProps) {
    const filled = CIRCUMFERENCE * props.progress
    return (
        <g>
            <circle r={RADIUS} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={3.5} />
            <circle
                r={RADIUS}
                fill="none"
                stroke={props.color}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
                transform="rotate(-90)"
            />
        </g>
    )
}

export function ReadyRing() {
    return (
        <circle className="animate-pulse" r={RADIUS} fill="none" stroke="#E9B949" strokeWidth={3.5} />
    )
}