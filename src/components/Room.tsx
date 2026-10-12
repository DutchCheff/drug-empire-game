import type { CSSProperties } from "react";
import { LockedSlot } from "../art/room/LockedSlot";
import { RoomBackground } from "../art/room/RoomBackground";
import { StashTable } from "../art/room/StashTable";
import { POT_SLOTS, ROOM_HEIGHT, ROOM_WIDTH, SLOT_SIZE, WAIT_SPOTS, STASH } from '../art/room/roomLayout'
import type { Dealer, Pot, StaffMember } from '../game/types'
import { RoomDealer } from "./RoomDealer";
import { RoomStaff } from './RoomStaff'
import { PotButton } from "./PotButton";

function slotStyle(index: number): CSSProperties {
    const slot = POT_SLOTS[index]
    return {
        left: `${((slot.x - SLOT_SIZE / 2) / ROOM_WIDTH) * 100}%`,
        top: `${((slot.y - SLOT_SIZE / 2) / ROOM_HEIGHT) * 100}%`,
        width: `${(SLOT_SIZE / ROOM_WIDTH) * 100}%`,
        height: `${(SLOT_SIZE / ROOM_HEIGHT) * 100}%`
    }
}

type BuySlotProps = {
    cost: number
    canAfford: boolean
    onClick: () => void
}

function BuySlot(props: BuySlotProps) {
    const priceColor = props.canAfford ? 'text-gold' : 'text-muted'
    return (
        <button
            type="button"
            disabled={!props.canAfford}
            onClick={props.onClick}
            aria-label={`Buy a pot for $${props.cost}`}
            className="relative h-full w-full rounded-full enabled:cursor-pointer enabled:hover:bg-white/5 disabled:cursor-not-allowed"
        >
            <svg viewBox="-56 -56 112 112" className="h-full w-full">
                <LockedSlot />
            </svg>
            <span className={`absolute inset-x-0 bottom-0 text-center font-mono text-sm ${priceColor}`}>
                ${props.cost}
            </span>
        </button>
    )
}

type RoomProps = {
    pots: Pot[]
    dealers: Dealer[]
    staff: StaffMember[]
    stash: number
    now: number
    potCost: number
    canBuyPot: boolean
    canPlant: boolean
    onPotClick: (potId: number) => void
    onBuyPot: () => void
    onSendDealer: (dealerId: number, grams: number) => void
}

export function Room(props: RoomProps) {
    const lockedSlots: number[] = []
    for (let index = props.pots.length; index < POT_SLOTS.length; index++) {
        lockedSlots.push(index)
    }

    return (
        <div className="relative aspect-2/1 w-full max-w-300 overflow-hidden rounded-xl">
            <RoomBackground />
            <svg viewBox={`0 0 ${ROOM_WIDTH} ${ROOM_HEIGHT}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                <g transform={`translate(${STASH.x} ${STASH.y}) scale(1.3)`}>
                    <StashTable grams={props.stash} />
                </g>
            </svg>
            {props.pots.map((pot, index) => (
                <div key={pot.id} className="absolute" style={slotStyle(index)}>
                    <PotButton
                        pot={pot}
                        now={props.now}
                        canPlant={props.canPlant}
                        onClick={() => props.onPotClick(pot.id)}
                    />
                </div>
            ))}
            {lockedSlots.map((index) => (
                <div key={index} className="absolute" style={slotStyle(index)}>
                    {index === props.pots.length ? (
                        <BuySlot cost={props.potCost} canAfford={props.canBuyPot} onClick={props.onBuyPot} />
                    ) : (
                        <svg viewBox="-56 -56 112 112" className="h-full w-full opacity-40" aria-hidden="true">
                            <LockedSlot />
                        </svg>
                    )}
                </div>
            ))}
            {props.dealers.map((dealer, index) => (
                <RoomDealer
                    key={dealer.id}
                    dealer={dealer}
                    spot={WAIT_SPOTS[index % WAIT_SPOTS.length]}
                    now={props.now}
                    canSend={props.stash > 0}
                    onSend={() => props.onSendDealer(dealer.id, dealer.stats.capacity)}
                />
            ))}
            {props.staff.map((member) => (
                <RoomStaff key={member.role} member={member} now={props.now} />
            ))}
        </div>
    )
}