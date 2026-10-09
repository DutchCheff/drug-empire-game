import { polar } from '../geometry'
import type { DealerLook } from './looks'

const REVERSE = '[animation-direction:alternate-reverse]'

type LimbProps = {
    look: DealerLook
    side: -1 | 1
    walking: boolean
}

function Foot(props: LimbProps) {
    const animation = props.walking ? `animate-step ${props.side === 1 ? REVERSE : ''}` : ''
    return (
        <g className={animation}>
            <ellipse
                cx={props.side * 5.6}
                cy={props.walking ? 0 : -8.5}
                rx={3.4}
                ry={5}
                fill={props.look.shoes}
                stroke="rgba(0,0,0,0.35)"
                strokeWidth={0.6}
            />
        </g>
    )
}

function Arm(props: LimbProps) {
    const x = props.side * 15.6
    const animation = props.walking ? `animate-swing ${props.side === 1 ? REVERSE : ''}` : ''
    return (
        <g className={animation}>
            <ellipse cx={x} rx={4.6} ry={7.5} fill={props.look.topShade} />
            {props.look.stripe && <path d={`M${x} -6 L${x} 6`} stroke={props.look.stripe} strokeWidth={1.4} strokeLinecap="round" />}
            {props.look.puffer && (
                <path
                    d={`M${props.side * 11.4} -1 L${props.side * 19.8} -1 M${props.side * 11.6} 3 L${props.side * 19.6} 3`}
                    stroke={props.look.top}
                    strokeWidth={1}
                />
            )}
            <circle cx={x} cy={-7} r={3} fill={props.look.skin} />
        </g>
    )
}

function Backpack() {
    return (
        <g>
            <rect x={-9.5} y={1.5} width={19} height={11} rx={3.5} fill="#3B3330" stroke="#241F1D" strokeWidth={0.8} />
            <rect x={-7} y={7} width={14} height={4.5} rx={1.8} fill="#4C423E" />
            <path d="M-6.5 1.5 L-7.5 -6 M6.5 1.5 L7.5 -6" stroke="#241F1D" strokeWidth={1.8} strokeLinecap="round" />
            <rect x={-3} y={3.4} width={6} height={2.6} rx={1} fill="#7FAE4E" />
        </g>
    )
}

type HeadProps = {
    look: DealerLook
}

function Ears(props: HeadProps) {
    return (
        <g>
            <ellipse cx={-7.4} cy={-0.6} rx={1.5} ry={2.2} fill={props.look.skin} />
            <ellipse cx={7.4} cy={-0.6} rx={1.5} ry={2.2} fill={props.look.skin} />
        </g>
    )
}

function Nose(props: HeadProps) {
    return <ellipse cy={-8.4} rx={1.6} ry={1.4} fill={props.look.skin} />
}

function Head(props: HeadProps) {
    const look = props.look
    switch (look.head) {
        case 'hood': {
            return (
                <g>
                    <path d="M-2 -8 L-2.6 -12.8 M2 -8 L2.6 -12.8" stroke="#E6E1D7" strokeWidth={0.9} strokeLinecap="round" />
                    <circle cy={0.6} r={10} fill={look.topShade} />
                    <circle cy={1.4} r={7.6} fill={look.top} />
                    <ellipse cy={-6.2} rx={5.2} ry={3.3} fill={look.skin} />
                    <path d="M-5.2 -6 Q0 -3.4 5.2 -6" stroke="rgba(0,0,0,0.25)" strokeWidth={0.9} fill="none" />
                </g>
            )
        }
        case 'cap': {
            return (
                <g>
                    <Ears look={look} />
                    <circle r={7.5} fill={look.skin} />
                    <path d="M-6.6 -4 Q0 -15 6.6 -4 Z" fill={look.hatShade} />
                    <circle cy={0.3} r={7.6} fill={look.hat} />
                    <path d="M0 0.3 L0 -7.3 M0 0.3 L6.6 4 M0 0.3 L-6.6 4" stroke={look.hatShade} strokeWidth={0.6} />
                    <circle cy={0.3} r={1.2} fill={look.hatShade} />
                </g>
            )
        }
        case 'beanie': {
            return (
                <g>
                    <Nose look={look} />
                    <Ears look={look} />
                    <circle r={8} fill={look.hat} />
                    <circle r={7.2} fill="none" stroke={look.hatShade} strokeWidth={1.6} />
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle) => {
                        const from = polar(angle, 3)
                        const to = polar(angle, 6.4)
                        return (
                            <path
                                key={angle}
                                d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
                                stroke={look.hatShade}
                                strokeWidth={0.6}
                            />
                        )
                    })}
                    <circle r={2.8} fill={look.pom} />
                </g>
            )
        }
        case 'hair': {
            return (
                <g>
                    <Nose look={look} />
                    <Ears look={look} />
                    <circle r={7.5} fill={look.skin} />
                    <circle cy={1.1} r={7.1} fill={look.hair} />
                </g>
            )
        }
        case 'bucket': {
            return (
                <g>
                    <circle r={11} fill={look.hatShade} />
                    <circle r={9.6} fill="none" stroke={look.hat} strokeWidth={0.7} strokeDasharray="1.6 1.4" />
                    <circle r={7} fill={look.hat} />
                    <circle r={4} fill="none" stroke={look.hatShade} strokeWidth={0.6} />
                </g>
            )
        }
    }
}

type DealerSpriteProps = {
    look: DealerLook
    walking: boolean
    backpack: boolean
}

export function DealerSprite(props: DealerSpriteProps) {
    const look = props.look
    return (
        <g>
            <ellipse cx={1} cy={2.5} rx={19} ry={13} fill="rgba(0,0,0,0.24)" />
            <Foot look={look} side={-1} walking={props.walking} />
            <Foot look={look} side={1} walking={props.walking} />
            <Arm look={look} side={-1} walking={props.walking} />
            <Arm look={look} side={1} walking={props.walking} />
            <ellipse cy={1.2} rx={16} ry={10} fill={look.topShade} />
            <ellipse rx={15.3} ry={9} fill={look.top} />
            {look.puffer && (
                <path d="M-14 -3.5 Q0 -7 14 -3.5 M-15 2.5 Q0 -0.5 15 2.5" stroke={look.topShade} strokeWidth={1.2} fill="none" />
            )}
            {props.backpack && <Backpack />}
            <Head look={look} />
        </g>
    )
}