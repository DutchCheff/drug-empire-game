import { DealerSprite } from '../art/dealers/DealerSprite'
import { lookFor } from '../art/dealers/looks'
import { dealerPlacement } from '../art/dealers/walking'
import { ROOM_HEIGHT, ROOM_WIDTH } from '../art/room/roomLayout'
import type { Dealer } from '../game/types'

const SPRITE_SIZE = 80

type RoomDealerProps = {
    dealer: Dealer
    spot: { x: number; y: number }
    now: number
    canSend: boolean
    onSend: () => void
}

export function RoomDealer(props: RoomDealerProps) {
    const placement = dealerPlacement(props.dealer, props.spot, props.now)
    if (placement === null) {
        return null
    }
    const canClick = props.dealer.status === 'idle' && props.canSend

    return (
        <button
            type="button"
            disabled={!canClick}
            onClick={props.onSend}
            aria-label={`Send ${props.dealer.name} with a full load`}
            className="absolute rounded-full transition-[left,top] duration-250 ease-linear enabled:cursor-pointer enabled:hover:bg-white/10"
            style={{
                left: `${((placement.point.x - SPRITE_SIZE / 2) / ROOM_WIDTH) * 100}%`,
                top: `${((placement.point.y - SPRITE_SIZE / 2) / ROOM_HEIGHT) * 100}%`,
                width: `${(SPRITE_SIZE / ROOM_WIDTH) * 100}%`,
                height: `${(SPRITE_SIZE / ROOM_HEIGHT) * 100}%`,
            }}
        >
            <svg viewBox="-30 -30 60 60" className="h-full w-full overflow-visible" style={{ transform: `rotate(${placement.angle}deg)` }}>
                <DealerSprite look={lookFor(props.dealer.look)} walking={placement.walking} backpack={props.dealer.carrying > 0} />
            </svg>
        </button>
    )
}