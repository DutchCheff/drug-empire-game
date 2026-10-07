type SparkleProps = {
    x: number
    y: number
    size: number
    delay: number
}

export function Sparkle(props: SparkleProps) {
    const size = props.size
    const star = `M0 ${-size} Q0 0 ${size} 0 Q0 0 0 ${size} Q0 0 ${-size} 0 Q0 0 0 ${-size} Z`
    return (
        <g transform={`translate(${props.x} ${props.y})`}>
            <path
                d={star}
                fill="#FFF8DC"
                className="origin-center transform-fill animate-sparkle motion-reduce:animate-none"
                style={{ animationDelay: `${props.delay}s` }}
            />
        </g>
    )
}