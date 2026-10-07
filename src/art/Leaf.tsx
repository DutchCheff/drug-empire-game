import { PLANT } from "./colors";
import { polar } from "./geometry";
import { seededRandom } from "./random";

export type LeafletCount = 1 | 3 | 5 | 7

function leafletPath(length: number, width: number) {
    const samples = Math.max(4, Math.round(length / 2.6)) * 2
    const right: { x: number; y: number }[] = []
    for (let index = 1; index < samples; index++) {
        const along = index / samples
        const profile = Math.pow(Math.sin(Math.PI * Math.pow(along, 0.8)), 0.85)
        const isTooth = index % 2 === 1
        const x = width * profile * (isTooth ? 1.16 : 0.9)
        const y = -length * along - (isTooth ? length * 0.015 : 0)
        right.push({ x, y })
    }
    const left = right.map((point) => ({ x: -point.x, y: point.y })).reverse()
    const points = [{ x: 0, y: 0}, ...right, { x: 0, y: -length }, ...left]
    return 'M' + points.map((point) => `${point.x} ${point.y}`).join(' L') + ' Z'
}

const LAYOUTS: Record<LeafletCount, [number, number][]> = {
    1: [[0, 1]],
    3: [[38, 0.68], [-38, 0.68], [0, 1]],
    5: [[62, 0.48], [-62, 0.48], [30, 0.8], [-30, 0.8], [0, 1]],
    7: [[78, 0.36], [-78, 0.36], [50, 0.64], [-50, 0.64], [24, 0.86], [-24, 0.86], [0, 1]],
}

type FanLeafProps = {
    x: number
    y: number
    angle: number
    length: number
    leaflets: LeafletCount
    fill: string
    width?: number
}

export function FanLeaf(props: FanLeafProps) {
    const width = props.width ?? 0.19
    return (
        <g transform={`translate(${props.x} ${props.y}) rotate(${props.angle})`}>
            {LAYOUTS[props.leaflets].map((leaflet, index) => {
                const length = props.length * leaflet[1]
                return (
                    <g key={index} transform={`rotate(${leaflet[0]})`}>
                        <path
                            d={leafletPath(length, length * width)}
                            fill={props.fill}
                            stroke={PLANT.rib}
                            strokeWidth={0.5}
                            strokeLinejoin="round"
                        />
                        <path
                            d={`M0 ${-length * 0.08} L0 ${-length * 0.86}`}
                            stroke={PLANT.rib}
                            strokeWidth={Math.max(0.45, length * 0.035)}
                            strokeLinecap="round"
                        />
                    </g>
                )
            })}
        </g>
    )
}

type LeafRingProps = {
    count: number
    offset: number
    distance: number
    length: number
    leaflets: LeafletCount
    fills: string []
    jitter: number
    seed: number
}

export function LeafRing(props: LeafRingProps) {
    const random = seededRandom(props.seed)
    const leaves = []
    for (let index = 0; index < props.count; index++) {
        const angle = props.offset + (index * 360) / props.count + (random() - 0.5) * props.jitter
        leaves.push({
            angle,
            base: polar(angle, props.distance),
            length: props.length * (1 + (random() - 0.5) * 0.12),
            fill: props.fills[index % props.fills.length],
        })
    }
    return (
        <g>
            {leaves.map((leaf, index) => (
                <g key={index}>
                    <line
                        x1={0}
                        y1={0}
                        x2={leaf.base.x}
                        y2={leaf.base.y}
                        stroke={PLANT.stem}
                        strokeWidth={1.6}
                        strokeLinecap="round"
                    />
                    <FanLeaf
                        x={leaf.base.x}
                        y={leaf.base.y}
                        angle={leaf.angle}
                        length={leaf.length}
                        leaflets={props.leaflets}
                        fill={leaf.fill}
                    />
                </g>
            ))}
        </g>
    )
}