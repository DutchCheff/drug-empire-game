import { useState } from 'react'
import { CONFIG } from '../../game/config'
import { hireCost } from '../../game/costs'
import { findStaff, staffStatus, wagesPerMinute } from '../../game/staff'
import type { Dealer, DealerCandidate, StaffMember, StaffRole } from '../../game/types'
import { DealerTile } from './DealerTile'
import { HireModal } from './HireModal'
import { SendModal } from './SendModal'
import { StaffModal } from './StaffModal'
import { GardenerSettings, RunnerSettings } from './StaffSettings'
import { StaffTile } from './StaffTile'

type HotbarTab = 'dealers' | 'growers' | 'runners'

type HotbarProps = {
    dealers: Dealer[]
    candidates: DealerCandidate[]
    now: number
    stash: number
    cash: number
    staff: StaffMember[]
    staffPaid: boolean
    minStash: number
    fullLoadsOnly: boolean
    onSend: (dealerId: number, grams: number) => void
    onHire: (candidateIndex: number) => void
    onHireStaff: (role: StaffRole) => void
    onToggleStaff: (role: StaffRole) => void
    onMinStash: (grams: number) => void
    onFullLoadsOnly: (value: boolean) => void
}

export function Hotbar(props: HotbarProps) {
    const [selected, setSelected] = useState<number | 'hire' | null>(null)
    const [tab, setTab] = useState<HotbarTab>('dealers')
    const [open, setOpen] = useState(true)
    const [staffModal, setStaffModal] = useState<StaffRole | null>(null)
    const selectedDealer = props.dealers.find((dealer) => dealer.id === selected)
    const cheapestHire = Math.min(...props.candidates.map((candidate) => hireCost(candidate, props.dealers.length)))
    const crewFull = props.dealers.length >= CONFIG.dealer.maxDealers

    const idleCount = props.dealers.filter((dealer) => dealer.status === 'idle').length
    const awayCount = props.dealers.length - idleCount
    const gardener = findStaff(props.staff, 'gardener')
    const runner = findStaff(props.staff, 'runner')
    const gardenerStatus = staffStatus(gardener, props.staffPaid)
    const runnerStatus = staffStatus(runner, props.staffPaid)
    const wages = wagesPerMinute(props.staff)
    const tabs = [
        { id: 'dealers' as const, label: 'Dealers', count: props.dealers.length, hint: `${idleCount} idle · ${awayCount} away` },
        { id: 'growers' as const, label: 'Growers', count: gardener === undefined ? 0 : 1, hint: gardenerStatus },
        { id: 'runners' as const, label: 'Runners', count: runner === undefined ? 0 : 1, hint: runnerStatus },
    ]

    function toggle(next: number | 'hire') {
        setSelected(selected === next ? null : next)
    }

    function handleTab(next: HotbarTab) {
        if (open && tab === next) {
            setOpen(false)
        } else {
            setTab(next)
            setOpen(true)
        }
    }

    return (
        <>
            {selectedDealer !== undefined && (
                <SendModal
                    key={selectedDealer.id}
                    dealer={selectedDealer}
                    stash={props.stash}
                    onSend={(grams) => {
                        props.onSend(selectedDealer.id, grams)
                        setSelected(null)
                    }}
                    onClose={() => setSelected(null)}
                />
            )}
            {selected === 'hire' && (
                <HireModal
                    candidates={props.candidates}
                    dealerCount={props.dealers.length}
                    cash={props.cash}
                    onHire={(candidateIndex) => {
                        props.onHire(candidateIndex)
                        setSelected(null)
                    }}
                    onClose={() => setSelected(null)}
                />
            )}
            {staffModal !== null && (
                <StaffModal
                    role={staffModal}
                    status={staffModal === 'gardener' ? gardenerStatus : runnerStatus}
                    cash={props.cash}
                    onHire={() => props.onHireStaff(staffModal)}
                    onToggle={() => props.onToggleStaff(staffModal)}
                    onClose={() => setStaffModal(null)}
                >
                    {staffModal === 'gardener' ? (
                        <GardenerSettings />
                    ) : (
                        <RunnerSettings
                            minStash={props.minStash}
                            fullLoadsOnly={props.fullLoadsOnly}
                            onMinStash={props.onMinStash}
                            onFullLoadsOnly={props.onFullLoadsOnly}
                        />
                    )}
                </StaffModal>
            )}

            <footer className="w-full max-w-300 overflow-hidden rounded-xl border border-edge bg-ground">
                <div role="tablist" className="flex items-end gap-1.5 px-4 pt-2.5">
                    {tabs.map((item) => {
                        const active = open && tab === item.id
                        return (
                            <button
                                key={item.id}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                aria-expanded={active}
                                onClick={() => handleTab(item.id)}
                                className={`flex h-12 cursor-pointer items-center gap-2.5 rounded-t-lg border border-b-0 border-edge px-4 font-semibold ${active ? 'bg-panel text-paper shadow-[inset_0_3px_0_var(--color-leaf)]' : 'text-muted hover:text-paper'}`}
                            >
                                {item.label}
                                <span className="flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-edge px-1.5 font-mono text-xs text-paper">
                                    {item.count}
                                </span>
                                <span className="font-mono text-xs font-normal text-muted">{item.hint}</span>
                            </button>
                        )
                    })}
                    {wages > 0 && <span className="ml-auto pb-3 font-mono text-xs text-muted">wages ${wages} / min</span>}
                </div>

                <div className={`grid border-t border-edge bg-panel transition-[grid-template-rows] duration-300 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        {tab === 'dealers' && (
                            <div className="flex flex-wrap items-start justify-center gap-3 p-4">
                                {props.dealers.map((dealer) => (
                                    <DealerTile
                                        key={dealer.id}
                                        dealer={dealer}
                                        now={props.now}
                                        selected={selected === dealer.id}
                                        onClick={() => toggle(dealer.id)}
                                    />
                                ))}
                                <div className="flex w-24 flex-col items-center gap-1">
                                    <button
                                        type="button"
                                        disabled={crewFull}
                                        onClick={() => toggle('hire')}
                                        aria-label={crewFull ? 'Crew is full' : `Hire a dealer, from $${cheapestHire}`}
                                        className={`flex size-19 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-muted/60 text-3xl enabled:hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40 ${selected === 'hire' ? 'ring-2 ring-paper' : ''}`}
                                    >
                                        +
                                    </button>
                                    <span className="text-sm font-semibold">Hire</span>
                                    {crewFull ? (
                                        <span className="font-mono text-xs text-muted">
                                            {props.dealers.length}/{CONFIG.dealer.maxDealers} full
                                        </span>
                                    ) : (
                                        <span className={`font-mono text-xs ${props.cash >= cheapestHire ? 'text-gold' : 'text-muted'}`}>
                                            from ${cheapestHire}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        {tab !== 'dealers' && (
                            <div className="flex flex-wrap items-start justify-center gap-3 p-4">
                                <StaffTile
                                    role={tab === 'growers' ? 'gardener' : 'runner'}
                                    status={tab === 'growers' ? gardenerStatus : runnerStatus}
                                    selected={staffModal === (tab === 'growers' ? 'gardener' : 'runner')}
                                    cash={props.cash}
                                    onClick={() => setStaffModal(tab === 'growers' ? 'gardener' : 'runner')}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </footer>
        </>
    )
}