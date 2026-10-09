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
    cash: number
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

export type GameState = {
    cash: number
    grams: number
    pots: Pot[]
    dealers: Dealer[]
    candidates: DealerCandidate[]
    seed: number
    savedAt: number
}