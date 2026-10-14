export type PlantStage =
  | 'empty'
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'ready'

export type StrainId =
  | 'classic'
  | 'northernLights'
  | 'blueDream'
  | 'sourDiesel'
  | 'ogKush'
  | 'granddaddyPurple'
  | 'girlScoutCookies'
  | 'gorillaGlue'

export type Strain = {
    id: StrainId
    name: string
    kind: 'Indica' | 'Sativa' | 'Hybrid' | null
    role: string
    growSeconds: number
    yieldGrams: number
    pricePerGram: number
    seedPrice: number
    unlockCost: number
}

export type StrainCounts = Record<StrainId, number>

export type GardenerMode = 'value' | 'fastest' | 'order'

export type Pot = {
    id: number
    plantedAt: number | null
    strain: StrainId
}


export type DealerStatus = 'idle' | 'out' | 'jailed'

export type DealerStats = {
    capacity: number
    cut: number
    robberyChance: number
    arrestChance: number
}

export type TripOutcome = 'sold' | 'robbed' | 'arrested'

export type TripResult = {
    outcome: TripOutcome
    grams: number
    cash: number
    at: number
}

export type DealerCandidate = {
    name: string
    stats: DealerStats
}

export type Dealer = DealerCandidate & {
    id: number
    status: DealerStatus
    // When the current trip or jail time started, null when idle.
    statusSince: number | null
    carrying: number
    carryingValue: number
    lastTrip: TripResult | null
}

export type StaffRole = 'gardener' | 'runner'

export type StaffMember = {
    role: StaffRole
    enabled: boolean
    nextActionAt: number
    potId: number | null
    targetPotId: number | null
    movedAt: number
}

export type DockOrder = {
    offerIndex: number
    orderedAt: number
}

export type DockUnload = {
    amount: number
    at: number
}

export type Dock = {
    built: boolean
    order: DockOrder | null
    lastUnload: DockUnload | null
}

export type GameState = {
    cash: number
    stash: StrainCounts
    seeds: StrainCounts
    plantStrain: StrainId
    unlocked: StrainId[]
    gardenerOrder: StrainId[]
    gardenerMode: GardenerMode
    pots: Pot[]
    dealers: Dealer[]
    candidates: DealerCandidate[]
    staff: StaffMember[]
    staffPaid: boolean
    nextPayday: number
    minStash: number
    fullLoadsOnly: boolean
    dock: Dock
    seed: number
    savedAt: number
}