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
    carryGrams: 5,
    tripSeconds: 20,
  },
  pot: {
    baseCost: 25,
    costGrowth: 1.4,
  },
  offlineCapHours: 2,
} as const