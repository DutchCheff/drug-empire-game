type TrainingRingProps = {
    share: number
    paused: boolean
    className: string
}

export function TrainingRing(props: TrainingRingProps) {
    return (
        <svg viewBox="-10 -10 20 20" className={props.className} aria-hidden="true">
            <circle r={8} className="fill-ground" stroke="rgba(255,255,255,0.14)" strokeWidth={2.5} />
            <circle
                r={8}
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${props.share * 100} 100`}
                transform="rotate(-90)"
                className={props.paused ? 'stroke-muted' : 'stroke-gold'}
            />
            <path
                d="M-3 1.8 L0 -1.6 L3 1.8"
                fill="none"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={props.paused ? 'stroke-muted' : 'stroke-paper'}
            />
        </svg>
    )
}