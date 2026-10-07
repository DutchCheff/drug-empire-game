import type { PlantStage } from '../game/types'
import { Bud } from './Bud'
import { BUDS, PLANT } from './colors'
import { polar } from './geometry'
import { FanLeaf, LeafRing } from './Leaf'
import { Sparkle } from './Sparkle'

export function Seedling() {
    return (
        <g>
            <ellipse cx={-6.5} cy={0} rx={6.5} ry={3.6} fill={PLANT.leafLight} stroke={PLANT.rib} strokeWidth={0.5} />
            <ellipse cx={6.5} cy={0} rx={6.5} ry={3.6} fill={PLANT.leafLight} stroke={PLANT.rib} strokeWidth={0.5} />
            <FanLeaf x={0} y={-1} angle={0} length={11} leaflets={3} fill={PLANT.leafNew} />
            <FanLeaf x={0} y={1} angle={180} length={11} leaflets={3} fill={PLANT.leafNew} />
            <circle r={1.7} fill={PLANT.stem} />
        </g>
    )
}

export function Vegetative() {
    return (
        <g>
            <LeafRing count={6} offset={20} distance={9} length={26} leaflets={7} fills={[PLANT.leafDark]} jitter={10} seed={3} />
            <LeafRing count={5} offset={56} distance={5} length={19} leaflets={5} fills={[PLANT.leafMid]} jitter={12} seed={7} />
            <LeafRing count={3} offset={0} distance={1.5} length={9} leaflets={3} fills={[PLANT.leafNew]} jitter={0} seed={9} />
            <circle r={2} fill={PLANT.stem} />
        </g>
    )
}

const RIPE_OUTER_FILLS = [
    PLANT.leafLate,
    PLANT.leafLate,
    PLANT.leafYellow,
    PLANT.leafLate,
    PLANT.leafLate,
    PLANT.leafLate,
    PLANT.leafYellow,
]

const SIDE_BUD_ANGLES = [10, 70, 130, 190, 250, 310]

type FloweringProps = {
    ripe: boolean
}

export function Flowering(props: FloweringProps) {
    const colors = props.ripe ? BUDS.ripe : BUDS.flowering
    const outerFills = props.ripe ? RIPE_OUTER_FILLS : [PLANT.leafDark]
    const middleFill = props.ripe ? PLANT.leafLateMid : PLANT.leafMid
    const sideBudRadius = props.ripe ? 5.2 : 4.4

    return (
        <g>
            <LeafRing count={7} offset={10} distance={12} length={30} leaflets={7} fills={outerFills} jitter={8} seed={11} />
            <LeafRing count={6} offset={40} distance={7} length={21} leaflets={5} fills={[middleFill]} jitter={10} seed={13} />
            {SIDE_BUD_ANGLES.map((angle, index) => {
                const point = polar(angle, 18)
                return <Bud key={angle} x={point.x} y={point.y} radius={sideBudRadius} colors={colors} seed={20 + index} />
            })}
            <Bud x={0} y={0} radius={props.ripe ? 9.5 : 8} colors={colors} seed={40} />
        </g>
    )
}

function Sparkles() {
    return (
        <g>
            <Sparkle x={-14} y={-20} size={4} delay={0} />
            <Sparkle x={20} y={-6} size={3} delay={0.7} />
            <Sparkle x={-6} y={22} size={3.4} delay={1.3} />
            <Sparkle x={8} y={-2} size={2.6} delay={1.9} />
        </g>
    )
}

type PlantProps = {
    stage: PlantStage
}

export function Plant(props: PlantProps) {
    if (props.stage === 'empty') {
        return null
    }
    return (
        <g>
            <g className="origin-center transform-fill animate-sway motion-reduce:animate-none">
                {props.stage === 'seedling' && <Seedling />}
                {props.stage === 'vegetative' && <Vegetative />}
                {props.stage === 'flowering' && <Flowering ripe={false} />}
                {props.stage === 'ready' && <Flowering ripe={true} />}
            </g>
            {props.stage === 'ready' && <Sparkles />}
        </g>
    )
}