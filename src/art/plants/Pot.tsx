import { arcPath, polar } from "../geometry";
import { seededRandom } from "../../lib/random";

const COLORS = {
    rim: '#C2643A',
    rimHighlight: '#D9875C',
    inner: '#A3502E',
    soil: '#4B3322',
    soilDark: '#3A271A',
    soilLight: '#5E422D',
}

type Speck = { x: number, y: number, radius: number, dark: boolean }

function makeSpecks(seed: number) {
    const random = seededRandom(seed)
    const specks: Speck[] = []
    for (let index = 0; index < 18; index++) {
        const point = polar(random() * 360, Math.sqrt(random()) * 29.5)
        specks.push({ x: point.x, y: point.y, radius: 0.8 + random(), dark: random() > 0.5 })
    }
    return specks
}

const SPECKS = makeSpecks(5)

export function TerracottaPot() {
    return (
        <g>
            <circle cx={2} cy={4} r={41} fill="rgba(0,0,0,0.28)" />
            <circle r={40} fill={COLORS.rim} />
            <path
                d={arcPath(37.6, 285, 345)}
                stroke={COLORS.rimHighlight}
                strokeWidth={2.4}
                strokeLinecap="round"
                fill="none"
            />
            <circle r={35} fill={COLORS.inner} />
            <circle r={32.5} fill={COLORS.soil} />
            {SPECKS.map((speck, index) => (
                <circle
                    key={index}
                    cx={speck.x}
                    cy={speck.y}
                    r={speck.radius}
                    fill={speck.dark ? COLORS.soilDark : COLORS.soilLight}
                />
            ))}
        </g>
    )
}