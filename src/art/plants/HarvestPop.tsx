import type { CSSProperties } from "react";
import { CONFIG } from "../../game/config";
import { PLANT } from "../colors";
import { polar } from "../geometry";
import { FanLeaf } from "./Leaf";
import { seededRandom } from "../../lib/random";

type LeafBit = {
    start: { x: number; y: number };
    end: { x: number; y: number };
    angle: number;
    spin: number
}

function makeLeafBit(seed: number) {
    const random = seededRandom(seed)
    const bits: LeafBit[] = []
    for (let index = 0; index < 7; index++) {
        const angle = index * (360 / 7) + random() * 30
        bits.push({
            start: polar(angle, 8),
            end: polar(angle, 38 + random() * 12),
            angle: angle + random() * 60,
            spin: (random() - 0.5) * 360,
        })
    }
    return bits
}

const LEAF_BITS = makeLeafBit(77)

export function HarvestPop() {
    return (
        <g pointerEvents="none" className="motion-reduce:hidden">
            {LEAF_BITS.map((bit, index) => {
                // The keyframes read these variables to know where each bit flies to.
                const flight = {
                    '--pop-x': `${bit.end.x - bit.start.x}px`,
                    '--pop-y': `${bit.end.y - bit.start.y}px`,
                    '--pop-spin': `${bit.spin}deg`,
                } as CSSProperties
                return (
                    <g key={index} transform={`translate(${bit.start.x} ${bit.start.y})`}>
                        <g className="origin-center transform-fill animate-leaf-pop" style={flight}>
                            <FanLeaf x={0} y={0} angle={bit.angle} length={12} leaflets={3} fill={PLANT.leafLight} />
                        </g>
                    </g>
                )
            })}
            <text
                className="animate-float-up font-mono"
                y={4}
                textAnchor="middle"
                fontSize={16}
                fontWeight={500}
                fill="#E9B949"
                stroke="#1B1916"
                strokeWidth={3}
                paintOrder="stroke"
            >
                +{CONFIG.yieldGrams} g
            </text>
        </g>
    )
}