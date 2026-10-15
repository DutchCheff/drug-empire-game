import { STRAIN_LOOKS } from '../art/plants/strainLooks'
import { BY_PRICE, totalCount } from '../game/strains'
import type { StrainCounts, StrainId } from '../game/types'
import { Modal } from './Modal'

const COLUMNS = 'grid grid-cols-[minmax(0,1fr)_4.5rem_4.5rem_5.5rem] items-center gap-3'

type StashModalProps = {
    stash: StrainCounts
    unlocked: StrainId[]
    onClose: () => void
}

export function StashModal(props: StashModalProps) {
    const total = totalCount(props.stash)
    const strains = BY_PRICE.filter((strain) => props.unlocked.includes(strain.id))
    const value = strains.reduce((sum, strain) => sum + props.stash[strain.id] * strain.pricePerGram, 0)

    return (
        <Modal
            title="Stash"
            subtitle={total > 0 ? `${total} g in stock` : 'Nothing in stock'}
            size="md"
            onClose={props.onClose}
        >
            {total > 0 ? (
                <div className="flex h-3 overflow-hidden rounded-full bg-ground">
                    {strains
                        .filter((strain) => props.stash[strain.id] > 0)
                        .map((strain) => (
                            <span
                                key={strain.id}
                                title={strain.name}
                                className="h-full"
                                style={{
                                    width: `${(props.stash[strain.id] / total) * 100}%`,
                                    background: STRAIN_LOOKS[strain.id].packet,
                                }}
                            />
                        ))}
                </div>
            ) : (
                <p className="text-sm text-muted">Harvest ripe plants to fill the stash.</p>
            )}

            <div className="flex flex-col gap-1.5">
                <div className={`${COLUMNS} px-3 font-mono text-xs text-muted`}>
                    <span>Strain</span>
                    <span className="text-right">Grams</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Value</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                    {strains.map((strain) => {
                        const grams = props.stash[strain.id]
                        return (
                            <li
                                key={strain.id}
                                className={`${COLUMNS} rounded-xl border border-edge bg-ground px-3 py-2.5 ${grams === 0 ? 'opacity-50' : ''}`}
                            >
                                <span className="flex min-w-0 items-center gap-2">
                                    <span
                                        className="size-3 shrink-0 rounded-full"
                                        style={{ background: STRAIN_LOOKS[strain.id].packet }}
                                    />
                                    <span className="truncate font-semibold">{strain.name}</span>
                                </span>
                                <span className="text-right font-mono">{grams} g</span>
                                <span className="text-right font-mono text-sm text-muted">${strain.pricePerGram}/g</span>
                                <span className="text-right font-mono text-gold">${grams * strain.pricePerGram}</span>
                            </li>
                        )
                    })}
                </ul>
                <div className={`${COLUMNS} border-t border-edge px-3 pt-3 font-semibold`}>
                    <span>Total</span>
                    <span className="text-right font-mono">{total} g</span>
                    <span />
                    <span className="text-right font-mono text-gold">${value}</span>
                </div>
            </div>

            <p className="text-sm text-muted">
                Selling and dealers take the most expensive grams first, from the top of this list down.
            </p>
        </Modal>
    )
}