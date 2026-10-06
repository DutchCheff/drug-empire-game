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


export type DealerStatus = 'idle' | 'out'

export type Dealer = {
    id: number
    name: string
    status: DealerStatus
    leftAt: number | null
    carrying: number
}

export type GameState = {
    cash: number
    grams: number
    pots: Pot[]
    dealers: Dealer[]
    savedAt: number
}
