// All tunable game numbers live here.
export const CONFIG = {
  startCash: 20,
  startPots: 4,
  maxPots: 6,
  seedCost: 5,
  // seedling -> vegetative -> flowering
  stageSeconds: 10,
  yieldGrams: 3,
  pricePerGram: 4,
  dealer: {
    baseCost: 50,
    costGrowth: 1.5,
    tripSeconds: 20,
    jailSeconds: 120,
    candidateCount: 3,
    hireCostMultiplier: [0.6, 1.8],
    capacity: [10, 25],
    //Share of the stree price the dealer keeps.
    cut: [0.15, 0.4],
    robberyChance: [0.02, 0.1],
    arrestChance: [0.01, 0.05],
  },
  pot: {
    baseCost: 25,
    costGrowth: 1.4,
  },
  awaySummarySeconds: 60,
} as const