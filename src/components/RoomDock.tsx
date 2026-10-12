import { useState, type CSSProperties } from 'react'
import { Pallet } from '../art/dock/Pallet'
import { Van } from '../art/dock/Van'
import { vanPlacement } from '../art/dock/vanPose'
import { LockedSlot } from '../art/room/LockedSlot'
import { DOCK, ROOM_HEIGHT, ROOM_WIDTH } from '../art/room/roomLayout'
import { CONFIG } from '../game/config'
import { arrivalAt, dockStatus, formatClock, secondsLeft } from '../game/dock'
import type { Dock } from '../game/types'
import { BulkOrderModal } from './BulkOrderModal'

const VAN_BOX = { width: 170, height: 70 }
const PALLET_BOX = 100
const SLOT_BOX = 110
const TIMER_BOX = 60
const FLOAT_MS = 1200

const CLICK_AREA = {
    x: (DOCK.bay.x + DOCK.door.x + DOCK.door.width) / 2,
    y: DOCK.door.y + DOCK.door.height / 2,
    width: DOCK.door.x + DOCK.door.width - DOCK.bay.x,
    height: DOCK.door.height,
}

function boxStyle(x: number, y: number, width: number, height: number): CSSProperties {
    return {
        left: `${((x - width / 2) / ROOM_WIDTH) * 100}%`,
        top: `${((y - height / 2) / ROOM_HEIGHT) * 100}%`,
        width: `${(width / ROOM_WIDTH) * 100}%`,
        height: `${(height / ROOM_HEIGHT) * 100}%`,
    }
}

type RoomDockProps = {
    dock: Dock
    now: number
    cash: number
    onBuild: () => void
    onOrder: (offerIndex: number) => void
    onUnload: () => void
}

export function RoomDock(props: RoomDockProps) {
    const [ordering, setOrdering] = useState(false)
    const status = dockStatus(props.dock, props.now)
    const van = vanPlacement(props.dock, props.now)
    const order = props.dock.order
    const unload = props.dock.lastUnload
    const pallet = DOCK.pallet

    if (status === 'locked') {
        const canBuild = props.cash >= CONFIG.dock.buildCost
        return (
            <button
                type="button"
                disabled={!canBuild}
                onClick={props.onBuild}
                aria-label={`Build a loading dock for $${CONFIG.dock.buildCost}`}
                className="absolute rounded-full enabled:cursor-pointer enabled:hover:bg-white/5 disabled:cursor-not-allowed"
                style={boxStyle(pallet.x, pallet.y, SLOT_BOX, SLOT_BOX)}
            >
                <svg viewBox="-56 -56 112 112" className="h-full w-full">
                    <LockedSlot />
                </svg>
                <span className={`absolute inset-x-0 bottom-0 text-center font-mono text-xs ${canBuild ? 'text-gold' : 'text-muted'}`}>
                    Dock · ${CONFIG.dock.buildCost}
                </span>
            </button>
        )
    }

    return (
        <>
            {van !== null && (
                <div
                    className="pointer-events-none absolute transition-[left,top,transform] duration-250 ease-linear"
                    style={{ ...boxStyle(van.x, van.y, VAN_BOX.width, VAN_BOX.height), transform: `rotate(${van.angle}deg)` }}
                >
                    <svg viewBox="-85 -35 170 70" className="h-full w-full overflow-visible" aria-hidden="true">
                        <Van doorsOpen={van.parked} />
                    </svg>
                </div>
            )}

            <button
                type="button"
                onClick={() => setOrdering(true)}
                aria-label="Open bulk orders"
                className="absolute cursor-pointer rounded-md hover:bg-white/5"
                style={boxStyle(CLICK_AREA.x, CLICK_AREA.y, CLICK_AREA.width, CLICK_AREA.height)}
            />

            {status === 'onTheWay' && order !== null && (
                <svg
                    viewBox="-30 -30 60 60"
                    className="pointer-events-none absolute"
                    style={boxStyle(pallet.x - 8, pallet.y, TIMER_BOX, TIMER_BOX)}
                    aria-hidden="true"
                >
                    <circle r={22} className="fill-ground" />
                    <circle
                        r={22}
                        fill="none"
                        strokeWidth={3}
                        pathLength={100}
                        strokeDasharray={`${((props.now - order.orderedAt) / (arrivalAt(order) - order.orderedAt)) * 100} 100`}
                        transform="rotate(-90)"
                        className="stroke-gold"
                    />
                    <text y={4} textAnchor="middle" fontSize={11} className="fill-paper font-mono">
                        {formatClock(secondsLeft(order, props.now))}
                    </text>
                </svg>
            )}

            {status === 'atDock' && order !== null && (
                <button
                    type="button"
                    onClick={props.onUnload}
                    aria-label={`Unload the pallet, ${CONFIG.dock.offers[order.offerIndex].amount} seeds`}
                    className="absolute cursor-pointer rounded-full hover:bg-white/10"
                    style={boxStyle(pallet.x, pallet.y, PALLET_BOX, PALLET_BOX)}
                >
                    <svg viewBox="-50 -50 100 100" className="h-full w-full">
                        <circle r={44} strokeWidth={3} className="animate-pulse fill-gold/10 stroke-gold" />
                        <Pallet loaded />
                    </svg>
                </button>
            )}

            {unload !== null && props.now - unload.at < FLOAT_MS && (
                <span
                    key={unload.at}
                    className="pointer-events-none absolute animate-float-up text-center font-mono text-sm font-semibold text-leaf"
                    style={boxStyle(pallet.x - 8, pallet.y - 10, 120, 24)}
                >
                    +{unload.amount} seeds
                </span>
            )}

            {ordering && (
                <BulkOrderModal
                    dock={props.dock}
                    cash={props.cash}
                    now={props.now}
                    onOrder={(offerIndex) => {
                        props.onOrder(offerIndex)
                        setOrdering(false)
                    }}
                    onClose={() => setOrdering(false)}
                />
            )}
        </>
    )
}
