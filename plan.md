# Drug Empire — Plan

## Concept
Incremental clicker. Top-down view of the **inside** of one building.
Start small: a few weed plants, a handful of cash. Grow, harvest,
hire dealers to sell, reinvest.

## Core loop
1. **Plant** – buy a seed, place it in an empty pot.
2. **Grow** – plants grow on their own (seedling → vegetative → flowering).
3. **Harvest** – click a ripe plant → grams go to the stash.
4. **Sell** – click to sell yourself at first; dealers take over.
5. **Reinvest** – more pots, more dealers, bigger operation.

## Dealers
- Visible little character in the room: walks in, picks up product
  from the stash, walks out the door, comes back with cash.
- Hotbar at the bottom of the screen: one icon per hired dealer,
  showing how many are hired and whether each is out or idle.
- Each new dealer costs more than the last.

## v1 scope (first playable)
- One small room with ~4 pot slots
- One strain, fixed grow time and sell price
- Cash + stash counters
- Buy seeds, harvest, manual sell
- Hire dealers (character + hotbar icon)
- Buy extra pot slots
- Save/load to localStorage
- Offline progress (capped at 2 hours)

## Later
- Lamps (faster growth), fertilizer (bigger yield)
- More strains with different value/grow time
- Bigger buildings / more rooms
- Dealer upgrades (carry more, walk faster)
- Police heat / raids
- Prestige reset

## Tech
React + TypeScript + Tailwind + Vite (same as the city builder).

## Decisions

### Starting numbers (v1, "fast & snappy")
| Thing        | Value                          |
|--------------|--------------------------------|
| Start cash   | $20                            |
| Pots         | 4, all empty                   |
| Seed         | $5                             |
| Grow time    | 30s total (10s per stage)      |
| Yield        | 3 g per plant                  |
| Manual sell  | $4 / g                         |
| Dealer       | $50 for the first, then x1.5   |
| Dealer trip  | carries 5 g, ~20s round trip   |
| Extra pot    | $25 for the first, then x1.4   |

Roughly $7 profit per plant per 30s; first dealer in ~3-4 minutes.
All numbers live in one config file so they're easy to tune.

### Art style
Flat SVG drawn in code: plants (one shape per stage), dealers,
pots, stash and door. No image assets.

### Offline progress
Yes, capped at 2 hours. On load, plants catch up from their
timestamps and dealer trips are simulated for the time away.
Show a "while you were away" summary.
