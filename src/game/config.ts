// All tunable game numbers live here.
export const CONFIG = {
  startCash: 20,
  startPots: 4,
  maxPots: 9,
  startSeeds: 4,
  seedOffers: [
    { amount: 1, price: 5 },
    { amount: 10, price: 40 },
    { amount: 100, price: 375 },
  ],
  // seedling -> vegetative -> flowering
  stageSeconds: 10,
  yieldGrams: 5,
  pricePerGram: 4,
  dealer: {
    baseCost: 50,
    costGrowth: 1.2,
    tripSeconds: 20,
    jailSeconds: 120,
    candidateCount: 3,
    maxDealers: 6,
    hireCostMultiplier: [0.6, 1.8],
    capacity: [10, 25],
    //Share of the street price the dealer keeps.
    cut: [0.15, 0.4],
    robberyChance: [0.02, 0.1],
    arrestChance: [0.01, 0.05],
  },
  pot: {
    baseCost: 25,
    costGrowth: 1.4,
  },
  staff: {
    payEverySeconds: 60,
    defaultMinStash: 20,
    gardener: { hireCost: 150, wagePerMinute: 2, actionSeconds: 2, walkSeconds: 1.2 },
    runner: { hireCost: 250, wagePerMinute: 3, actionSeconds: 1},
  },
  dock: {
    buildCost: 400,
    offers: [
      { name: 'Seed crate', amount: 250, price: 800, seconds: 60 },
      { name: 'Seed pallet', amount: 1000, price: 3000, seconds: 90 },
    ],
  },
  offline: { capHours: 2, stepSeconds: 0.5 },
  awaySummarySeconds: 60,
} as const