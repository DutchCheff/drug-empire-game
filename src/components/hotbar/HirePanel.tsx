import { hireCost } from '../../game/costs'
import type { DealerCandidate } from '../../game/types'
import { DealerStatsList } from './DealerStatsList'

type HirePanelProps = {
    candidates: DealerCandidate[]
    dealerCount: number
    cash: number
    onHire: (candidateIndex: number) => void
    onClose: () => void
}

export function HirePanel(props: HirePanelProps) {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-edge bg-panel p-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Hire a dealer</h2>
                <button type="button" onClick={props.onClose} className="cursor-pointer text-muted hover:text-paper">
                    Close
                </button>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
                {props.candidates.map((candidate, index) => {
                    const cost = hireCost(candidate, props.dealerCount)
                    return (
                        <div key={index} className="flex flex-col gap-3 rounded-lg border border-edge bg-ground p-3">
                            <h3 className="font-semibold">{candidate.name}</h3>
                            <DealerStatsList stats={candidate.stats} />
                            <button
                                type="button"
                                disabled={props.cash < cost}
                                onClick={() => props.onHire(index)}
                                className="h-10 cursor-pointer rounded-lg bg-leaf px-4 font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Hire · ${cost}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}