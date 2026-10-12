export type PlantStage =
  | 'empty'
  | 'seedling'
  | 'vegetative'
  | 'flowering'
  | 'ready'

export type Pot = {
    id: number
    plantedAt: number | null
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

export type GameState = {
    cash: number
    grams: number
    seedStock: number
    pots: Pot[]
    dealers: Dealer[]
    candidates: DealerCandidate[]
    staff: StaffMember[]
    staffPaid: boolean
    nextPayday: number
    minStash: number
    seed: number
    savedAt: number
}