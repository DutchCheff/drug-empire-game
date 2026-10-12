import { DealerSprite } from '../../art/dealers/DealerSprite'
import { lookFor } from '../../art/dealers/looks'
import { CONFIG } from '../../game/config'
import { hireCost } from '../../game/costs'
import type { DealerCandidate } from '../../game/types'
import { Modal } from '../Modal'
import { DealerStatsList } from './DealerStatsList'

type HireModalProps = {
    candidates: DealerCandidate[]
    dealerCount: number
    cash: number
    onHire: (candidateIndex: number) => void
    onClose: () => void
}

export function HireModal(props: HireModalProps) {
    const look = lookFor(props.dealerCount + 1)

    return (
        <Modal
            title="Hire a dealer"
            subtitle={`Better stats cost more · ${props.dealerCount} of ${CONFIG.dealer.maxDealers} spots used`}
            size="lg"
            onClose={props.onClose}
        >
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
                {props.candidates.map((candidate, index) => {
                    const cost = hireCost(candidate, props.dealerCount)
                    return (
                        <div key={index} className="flex flex-col gap-3 rounded-xl border border-edge bg-ground p-3.5">
                            <div className="flex items-center gap-2.5">
                                <svg viewBox="-17 -18 34 34" className="size-11" aria-hidden="true">
                                    <DealerSprite look={look} walking={false} backpack={false} />
                                </svg>
                                <h3 className="text-lg font-semibold">{candidate.name}</h3>
                            </div>
                            <DealerStatsList stats={candidate.stats} />
                            <button
                                type="button"
                                disabled={props.cash < cost}
                                onClick={() => props.onHire(index)}
                                className="h-11 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Hire · ${cost}
                            </button>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}