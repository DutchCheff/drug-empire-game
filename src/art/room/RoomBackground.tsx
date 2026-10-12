import { ROOM } from '../colors'
import { DOCK, FLOOR, ROOM_HEIGHT, ROOM_WIDTH } from './roomLayout'

const TILE = 92
const STREET_TOP = 552

function range(from: number, to: number, step: number) {
    const values = []
    for (let value = from; value < to; value += step) {
        values.push(value)
    }
    return values
}

type LoadingDockProps = {
    open: boolean
}

function LoadingDock(props: LoadingDockProps) {
    const door = DOCK.door
    const bay = DOCK.bay
    const apron = DOCK.apron
    const laneLeft = apron.x + 13
    const laneRight = apron.x + apron.width - 10

    return (
        <g>
            <defs>
                <pattern id="dock-hazard" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width={12} height={12} fill={ROOM.hazardDark} />
                    <rect width={6} height={12} fill={ROOM.hazardGold} />
                </pattern>
            </defs>
            <rect x={apron.x} y={apron.y} width={apron.width} height={apron.height} fill={ROOM.apron} />
            <path
                d={`M${laneLeft} ${door.y - 4} H${laneRight} M${laneLeft} ${door.y + door.height + 4} H${laneRight}`}
                stroke={ROOM.laneLine}
                strokeWidth={2}
                strokeDasharray="14 8"
            />
            <path d={`M${apron.x} ${apron.y} H${ROOM_WIDTH}`} stroke={ROOM.curb} strokeWidth={2} />
            <rect x={door.x - 12} y={door.y} width={12} height={door.height} fill="url(#dock-hazard)" />
            <rect
                x={bay.x}
                y={bay.y}
                width={bay.width}
                height={bay.height}
                rx={2}
                fill="none"
                stroke={ROOM.bay}
                strokeWidth={2}
                strokeDasharray="8 5"
            />
            <rect
                x={door.x}
                y={door.y}
                width={door.width}
                height={door.height}
                fill={props.open ? ROOM.hazardDark : ROOM.threshold}
                stroke={ROOM.rollerEdge}
                strokeWidth={1}
            />
            {props.open ? (
                <path
                    d={`M${door.x + 2} ${door.y + 3} H${door.x + 20} M${door.x + 2} ${door.y + door.height - 3} H${door.x + 20}`}
                    stroke={ROOM.rollerRib}
                    strokeWidth={2}
                />
            ) : (
                range(door.y + 9, door.y + door.height, 9).map((y) => (
                    <path key={y} d={`M${door.x + 2} ${y} H${door.x + 21}`} stroke={ROOM.rollerRib} strokeWidth={1.5} />
                ))
            )}
            {[door.y - 9, door.y + door.height + 9].map((y) => (
                <circle key={y} cx={apron.x + 10} cy={y} r={6} fill={ROOM.bollard} stroke={ROOM.bollardShade} strokeWidth={1.2} />
            ))}
        </g>
    )
}

type RoomBackgroundProps = {
    dockBuilt: boolean
    dockOpen: boolean
}

export function RoomBackground(props: RoomBackgroundProps) {
    return (
        <svg viewBox={`0 0 ${ROOM_WIDTH} ${ROOM_HEIGHT}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            <rect width={ROOM_WIDTH} height={ROOM_HEIGHT} fill={ROOM.outside} />

            <rect x={0} y={STREET_TOP} width={ROOM_WIDTH} height={ROOM_HEIGHT - STREET_TOP} fill={ROOM.street} />
            {range(30, ROOM_WIDTH, 70).map((x) => (
                <path key={x} d={`M${x} ${STREET_TOP} V${ROOM_HEIGHT}`} stroke={ROOM.streetLine} strokeWidth={1.5} />
            ))}
            <path d={`M0 ${STREET_TOP} H${ROOM_WIDTH}`} stroke={ROOM.curb} strokeWidth={3} />

            <rect x={210} y={30} width={780} height={520} fill={ROOM.wallTop} stroke={ROOM.wallEdge} strokeWidth={2} />
            <rect
                x={FLOOR.left}
                y={FLOOR.top}
                width={FLOOR.right - FLOOR.left}
                height={FLOOR.bottom - FLOOR.top}
                fill={ROOM.floor}
                stroke={ROOM.wallEdge}
                strokeWidth={2}
            />
            {range(FLOOR.left + TILE, FLOOR.right, TILE).map((x) => (
                <path key={x} d={`M${x} ${FLOOR.top} V${FLOOR.bottom}`} stroke={ROOM.floorLine} strokeWidth={1.5} />
            ))}
            {range(FLOOR.top + TILE, FLOOR.bottom, TILE).map((y) => (
                <path key={y} d={`M${FLOOR.left} ${y} H${FLOOR.right}`} stroke={ROOM.floorLine} strokeWidth={1.5} />
            ))}
            <rect x={FLOOR.left} y={FLOOR.top} width={FLOOR.right - FLOOR.left} height={10} fill="rgba(0,0,0,0.18)" />
            <rect x={FLOOR.left} y={FLOOR.top + 10} width={10} height={FLOOR.bottom - FLOOR.top - 10} fill="rgba(0,0,0,0.18)" />

            <rect x={760} y={527} width={80} height={24} fill={ROOM.threshold} />
            <path
                d="M840 528 A80 80 0 0 0 760 448"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                fill="none"
            />
            <rect x={757} y={448} width={7} height={80} rx={1} fill={ROOM.door} stroke={ROOM.doorShade} strokeWidth={1} />

            {props.dockBuilt && <LoadingDock open={props.dockOpen} />}
        </svg>
    )
}