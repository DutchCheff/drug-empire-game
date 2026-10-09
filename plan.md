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
- Visible little character in the room. Idle dealers wait in the room
  until you hand them product; they don't take it on their own.
- Click a dealer **in the room**: they fill up to their capacity and leave.
- Click a dealer **in the hotbar**: choose an amount (− / + / Max), then Send.
- They walk out the door, and after the trip they come back with the result.
- Hotbar at the bottom of the screen: one tile per hired dealer,
  showing idle / out (trip progress) / jailed (time left) and the last result.
- Hiring shows 3 random candidates with their stats; you pick one.
  New candidates after a hire. One-time hire fee, no wages (their pay is the cut).
- Hire fee = base ($50 for the first, then x1.5) x 0.6–1.8 depending on
  quality: capacity and cut weigh 35% each, robbery and arrest 15% each.
  First hire costs $30 (worst possible) to $90 (best possible).
- Every dealer has their own random stats (upgradeable later):

| Stat           | Range      | Effect per trip                                   |
|----------------|------------|---------------------------------------------------|
| Carry capacity | 10–25 g    | most you can hand them                            |
| Cut            | 15–40%     | share of the $4 street price the dealer keeps     |
| Robbery chance | 2–10%      | product gone, they come back empty-handed         |
| Arrest chance  | 1–5%       | product confiscated, dealer jailed for 2 minutes  |

- Trip time is the same for everyone: 20 s.
- Dealers are distributors: per gram you earn less than selling yourself
  (street price minus their cut), but you can only sell 1 g per click
  yourself. Dealers move volume while you grow.
- Rolls use a seed stored in the save, so a refresh can't reroll a result.
- Later: choose a strain per hand-off, automation, upgrades.

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
- Dealer upgrades (carry more, lower cut, safer)
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
| Dealer trip  | 20s round trip, stats per dealer (see Dealers) |
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
