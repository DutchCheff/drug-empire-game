import { CONFIG } from '../../game/config'
import { getJailSecondsLeft, getTripProgress } from '../../game/dealers'
import { formatClock } from '../../game/dock'
import { DealerSprite } from '../../art/dealers/DealerSprite'
import { lookFor } from '../../art/dealers/looks'
import { trainingShare } from '../../game/training'
import type { Dealer } from '../../game/types'
import { TrainingRing } from './TrainingRing'

function statusLine(dealer: Dealer, now: number) {
    if (dealer.status === 'out') {
        const secondsLeft = Math.ceil((1 - getTripProgress(dealer, now)) * CONFIG.dealer.tripSeconds)
        return { text: `out · ${secondsLeft} s`, color: 'text-muted' }
    }
    if (dealer.status === 'jailed') {
        return { text: `jail · ${formatClock(getJailSecondsLeft(dealer, now))}`, color: 'text-danger' }
    }
    if (dealer.lastTrip === null) {
        return { text: 'idle', color: 'text-leaf' }
    }
    switch (dealer.lastTrip.outcome) {
        case 'sold': {
            return { text: `+$${dealer.lastTrip.cash}`, color: 'text-leaf' }
        }
        case 'robbed': {
            return { text: 'robbed!', color: 'text-danger' }
        }
        case 'arrested': {
            return { text: 'out of jail', color: 'text-muted' }
        }
    }
}

const BORDERS = {
    idle: 'border-leaf',
    out: 'border-edge',
    jailed: 'border-danger',
}

type DealerTileProps = {
    dealer: Dealer
    now: number
    selected: boolean
    onClick: () => void
}

export function DealerTile(props: DealerTileProps) {
    const idle = props.dealer.status === 'idle'
    const status = statusLine(props.dealer, props.now)

    return (
        <div className="flex w-24 flex-col items-center gap-1">
            <button
                type="button"
                onClick={props.onClick}
                aria-label={`${props.dealer.name}: ${status.text}`}
                className={`relative flex size-19 cursor-pointer items-center justify-center rounded-xl border-2 bg-ground hover:bg-white/5 ${BORDERS[props.dealer.status]} ${props.selected ? 'ring-2 ring-paper' : ''}`}
            >
                <svg viewBox="-17 -18 34 34" className={`size-14 ${idle ? '' : 'opacity-50'}`} aria-hidden="true">
                    <DealerSprite look={lookFor(props.dealer.look)} walking={false} backpack={false} />
                </svg>
                {props.dealer.status === 'out' && (
                    <span className="absolute inset-x-1.5 bottom-1.5 h-1 rounded-full bg-white/10">
                        <span
                            className="block h-1 rounded-full bg-gold"
                            style={{ width: `${getTripProgress(props.dealer, props.now) * 100}%` }}
                        />
                    </span>
                )}
                {idle && <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-leaf" />}
                {props.dealer.training !== null && (
                    <TrainingRing
                        share={trainingShare(props.dealer, props.now)}
                        paused={props.dealer.status === 'jailed'}
                        className="absolute -top-2 -left-2 size-7"
                    />
                )}
            </button>
            <span className="text-sm font-semibold">{props.dealer.name}</span>
            <span className={`text-center font-mono text-xs ${status.color}`}>{status.text}</span>
        </div>
    )
}