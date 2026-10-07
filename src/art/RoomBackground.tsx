import { ROOM } from './colors'
import { FLOOR, ROOM_HEIGHT, ROOM_WIDTH } from './roomLayout'

const TILE = 92
const STREET_TOP = 552

function range(from: number, to: number, step: number) {
    const values = []
    for (let value = from; value < to; value += step) {
        values.push(value)
    }
    return values
}

export function RoomBackground() {
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
        </svg>
    )
}