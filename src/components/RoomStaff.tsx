import { ROOM_HEIGHT, ROOM_WIDTH } from '../art/room/roomLayout'
import { StaffSprite } from '../art/staff/StaffSprite'
import { staffPlacement } from '../art/staff/walking'
import type { StaffMember } from '../game/types'

const SPRITE_SIZE = 80
const MOVE_MS = 250

type RoomStaffProps = {
    member: StaffMember
    now: number
}

export function RoomStaff(props: RoomStaffProps) {
    const placement = staffPlacement(props.member, props.now + MOVE_MS)

    return (
        <div
            className="pointer-events-none absolute transition-[left,top] duration-250 ease-linear"
            style={{
                left: `${((placement.point.x - SPRITE_SIZE / 2) / ROOM_WIDTH) * 100}%`,
                top: `${((placement.point.y - SPRITE_SIZE / 2) / ROOM_HEIGHT) * 100}%`,
                width: `${(SPRITE_SIZE / ROOM_WIDTH) * 100}%`,
                height: `${(SPRITE_SIZE / ROOM_HEIGHT) * 100}%`,
            }}
        >
            <svg
                viewBox="-30 -30 60 60"
                className="h-full w-full overflow-visible"
                style={{ transform: `rotate(${placement.angle}deg)` }}
                aria-hidden="true"
            >
                <StaffSprite role={props.member.role} walking={placement.walking} />
            </svg>
        </div>
    )
}
