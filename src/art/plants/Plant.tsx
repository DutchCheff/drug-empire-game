import type { PlantStage, StrainId } from '../../game/types'
import { Bud } from './Bud'
import { mix, PLANT } from '../colors'
import { polar } from '../geometry'
import { FanLeaf, LeafRing } from './Leaf'
import { Sparkle } from './Sparkle'
import { FLOWERING_BUD, SPARKLE_SPOTS, STRAIN_LOOKS, type StrainLook } from './strainLooks'

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

type VegetativeProps = {
    look: StrainLook
}

export function Vegetative(props: VegetativeProps) {
    const look = props.look
    const scale = look.outerLength / 30
    const leafStyle = { width: look.leafWidth, rib: look.rib, stem: look.stem }

    return (
        <g>
            <LeafRing
                {...leafStyle}
                count={6}
                offset={20}
                distance={9}
                length={26 * scale}
                leaflets={look.leaflets}
                fills={[look.leafDark]}
                jitter={10}
                seed={3}
            />
            <LeafRing
                {...leafStyle}
                count={5}
                offset={56}
                distance={5}
                length={19 * scale}
                leaflets={look.leaflets === 7 ? 5 : 3}
                fills={[look.leafMid]}
                jitter={12}
                seed={7}
            />
            <LeafRing
                {...leafStyle}
                count={3}
                offset={0}
                distance={1.5}
                length={9}
                leaflets={3}
                fills={[mix(look.leafMid, '#B8E07A', 0.5)]}
                jitter={0}
                seed={9}
            />
            <circle r={2} fill={look.stem} />
        </g>
    )
}

type FloweringProps = {
    look: StrainLook
    ripe: boolean
}

export function Flowering(props: FloweringProps) {
    const look = props.look
    const scale = look.outerLength / 30
    const leafStyle = { width: look.leafWidth, rib: look.rib, stem: look.stem }
    const late = mix(look.leafDark, '#000000', 0.08)
    const colors = props.ripe ? look.bud : FLOWERING_BUD
    const outerFills = props.ripe ? [late, late, look.accent, late, late, late, look.accent] : [look.leafDark]
    const middleFill = props.ripe ? mix(look.leafMid, '#000000', 0.06) : look.leafMid
    const sideRadius = props.ripe ? look.sideRadius : look.sideRadius * 0.85
    const centerRadius = props.ripe ? look.centerRadius : look.centerRadius * 0.85
    const frost = props.ripe ? look.frost : 0
    const sideBuds = []
    for (let index = 0; index < look.sideCount; index++) {
        sideBuds.push(polar(10 + (index * 360) / look.sideCount, look.sideDistance))
    }

    return (
        <g>
            <LeafRing
                {...leafStyle}
                count={look.outerCount}
                offset={10}
                distance={12}
                length={look.outerLength}
                leaflets={look.leaflets}
                fills={outerFills}
                jitter={8}
                seed={11}
            />
            <LeafRing
                {...leafStyle}
                count={6}
                offset={40}
                distance={7}
                length={21 * scale}
                leaflets={look.leaflets === 7 ? 5 : 3}
                fills={[middleFill]}
                jitter={10}
                seed={13}
            />
            {sideBuds.map((point, index) => (
                <Bud
                    key={index}
                    x={point.x}
                    y={point.y}
                    radius={sideRadius}
                    colors={colors}
                    frost={frost}
                    pistils={look.pistils}
                    seed={20 + index}
                />
            ))}
            <Bud x={0} y={0} radius={centerRadius} colors={colors} frost={frost} pistils={look.pistils} seed={40} />
        </g>
    )
}

type PlantProps = {
    stage: PlantStage
    strain: StrainId
}

export function Plant(props: PlantProps) {
    if (props.stage === 'empty') {
        return null
    }
    const look = STRAIN_LOOKS[props.strain]

    return (
        <g>
            <g className="origin-center transform-fill animate-sway motion-reduce:animate-none">
                {props.stage === 'seedling' && <Seedling />}
                {props.stage === 'vegetative' && <Vegetative look={look} />}
                {props.stage === 'flowering' && <Flowering look={look} ripe={false} />}
                {props.stage === 'ready' && <Flowering look={look} ripe={true} />}
            </g>
            {props.stage === 'ready' &&
                SPARKLE_SPOTS.slice(0, look.sparkles).map((spot, index) => (
                    <Sparkle key={index} x={spot.x} y={spot.y} size={spot.size} delay={index * 0.6} />
                ))}
        </g>
    )
}
