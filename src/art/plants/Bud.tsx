import type { BudColors } from "../colors";
import { polar } from "../geometry";
import { FanLeaf } from "./Leaf";
import { seededRandom } from "../../lib/random";

type BudProps = {
    x: number
    y: number
    radius: number
    colors: BudColors
    seed: number
}

export function Bud(props: BudProps) {
    const random = seededRandom(props.seed)
    const radius = props.radius

    const sugarLeafAngles = [0, 120, 240].map((angle) => angle + random() * 40)

    const blobs = []
    for (let index = 0; index < 6; index++) {
        const point = polar(index * 60 + random() * 20, radius * 0.62)
        blobs.push({ x: point.x, y: point.y, radius: radius * (0.5 + random() * 0.15) })
    }

    // Pistils: the little curled orange hairs on the bud.
    const pistils = []
    const pistilCount = Math.ceil(radius * 1.4)
    for (let index = 0; index < pistilCount; index++) {
        const angle = random() * 360
        const start = radius * (0.2 + random() * 0.55)
        const length = radius * (0.35 + random() * 0.3)
        const from = polar(angle, start)
        const bend = polar(angle, start + length * 0.7)
        const to = polar(angle + 25, start + length)
        pistils.push(`M${from.x} ${from.y} Q${bend.x} ${bend.y} ${to.x} ${to.y}`)
    }

    const frost = []
    if (props.colors.frost) {
        const frostCount = Math.ceil(radius * 2.4)
        for (let index = 0; index < frostCount; index++) {
            const point = polar(random() * 360, Math.sqrt(random()) * radius * 1.05)
            frost.push({ x: point.x, y: point.y, radius: 0.3 + random() * 0.35 })
        }
    }

    return (
        <g transform={`translate(${props.x} ${props.y})`}>
            {sugarLeafAngles.map((angle, index) => (
                <FanLeaf
                    key={index}
                    x={0}
                    y={0}
                    angle={angle}
                    length={radius * 1.7}
                    leaflets={1}
                    fill={props.colors.sugar}
                    width={0.24}
                />
            ))}
            {blobs.map((blob, index) => (
                <circle key={index} cx={blob.x} cy={blob.y} r={blob.radius} fill={props.colors.shade} />
            ))}
            <circle r={radius * 0.78} fill={props.colors.main} />
            {blobs.slice(0, 3).map((blob, index) => (
                <circle key={index} cx={blob.x * 0.6} cy={blob.y * 0.6} r={blob.radius * 0.7} fill={props.colors.main} />
            ))}
            <circle cx={-radius * 0.25} cy={-radius * 0.28} r={radius * 0.32} fill={props.colors.light} />
            {pistils.map((path, index) => (
                <path
                    key={index}
                    d={path}
                    stroke={props.colors.pistil}
                    strokeWidth={Math.max(0.5, radius * 0.09)}
                    strokeLinecap="round"
                    fill="none"
                />
            ))}
            {frost.map((speck, index) => (
                <circle key={index} cx={speck.x} cy={speck.y} r={speck.radius} fill="#F5F7EA" />
            ))}
        </g>
    )
}
