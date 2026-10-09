# Drug Empire — Plan

## Concept
Incremental clicker. Top-down view of the **inside** of one building.
Start small: a few weed plants, a handful of cash. Grow, harvest,
hire dealers to sell, reinvest.

## Core loop
1. **Plant** – buy seeds in the store, plant one in an empty pot.
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
- Hire fee = base ($50 for the first, then x1.2) x 0.6–1.8 depending on
  quality: capacity and cut weigh 35% each, robbery and arrest 15% each.
  First hire costs $30 (worst possible) to $90 (best possible).
- Max 6 dealers in the first building (one waiting spot each).
  A bigger building later raises that limit.
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

## Store
- Store button in the top bar opens a store panel.
- **Seeds**: 1 seed $5, bundle of 10 for $40. Seeds go into a stock
  (shown in the top bar). Planting uses 1 seed from stock; with no seeds
  an empty pot can't be planted (click shows "No seeds, open the store").
- New game starts with 4 seeds and $20.
- Later sections in the same store:
  - Strains: other seed types with their own price, grow time and value.
  - Dealer gear: e.g. bigger backpack (+capacity), burner phone (−arrest chance).
  - Grow gear: lamps (faster growth), fertilizer (bigger yield).

## Staff (automation)
- Staff cost a one-time hire fee plus a wage per minute, paid from cash.
  When cash can't cover the wage, staff stop working until it can.
- **Gardener**: plants empty pots (uses seeds from stock) and harvests
  ripe plants, one action every few seconds. Setting: on/off.
  Proposed: hire $150, wage $2/min.
- **Runner**: hands product to idle dealers automatically. Settings:
  on/off, minimum stash to keep (default 20 g); everything above that is
  given out, each dealer filled up to their capacity.
  Proposed: hire $250, wage $3/min.
- Staff walk around in the room like dealers (art step after the logic).
- Later: more/faster staff, rules per dealer (e.g. only dealers with a low cut).

## Offline with automation
Once staff work on their own, time away matters: simulate gardener,
runner, dealer trips and wages for the time away, capped at 2 hours,
and show it in the "While you were away" summary.

## Implemented
- Plants: seed → seedling → vegetative → flowering → ready (10 s per stage),
  growth ring, harvest pop, sway and sparkles.
- Room: 3×3 pot slots (start with 4, buy up to 9), stash table that fills up,
  door, street.
- Top bar: cash, stash, seeds, Store, Sell 1 g.
- Store (panel for now): seeds 1 / 10 / 100; planting uses seed stock.
- Dealers: 3 candidates with random stats, hire fee by quality (max 6),
  hand-off by amount (hotbar) or full load (click in the room), trips with
  sold / robbed / arrested, jail time, walking sprites, portraits in the hotbar.
- Trip toasts, "While you were away" summary, save in localStorage.
- Dev panel (dev only): set cash and grams, ripen all pots.

## Roadmap (implementation, in order)
1. Modal shell from the UI kit; Store becomes a modal (tabs: Seeds now,
   the other tabs marked "Soon").
2. Send and Hire move into modals; Send shows the expected payout.
3. Tabbed hotbar: Dealers tab now, Growers and Runners tabs ready for staff.
4. Staff logic: hiring, wages per minute, unpaid state; gardener plants and
   harvests.
5. Runner with settings (on/off, minimum stash) and the Staff modal.
6. Staff characters in the room (gardener, runner).
7. Offline simulation with the 2-hour cap; away summary shows staff work
   and wages.
8. Store expansions: strains, dealer gear, grow gear (lamp, fertilizer).
9. Later: police heat, bigger buildings, prestige.

Design happens in a separate chat on the canvas; boards marked "vision" or
"Soon" are ideas until they're added to this roadmap.

## v1 scope (first playable)
- One small room: 4 pots to start, room for 9 (3 rows of 3)
- One strain, fixed grow time and sell price
- Cash + stash counters
- Buy seeds, harvest, manual sell
- Hire dealers (character + hotbar icon)
- Buy extra pot slots
- Save/load to localStorage
- "While you were away" summary

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
| Yield        | 5 g per plant                  |
| Manual sell  | $4 / g                         |
| Dealer       | $50 base, then x1.2, x0.6–1.8 by quality, max 6 |
| Dealer trip  | 20s round trip, stats per dealer (see Dealers) |
| Extra pot    | $25 for the first, then x1.4, max 9 pots |

Roughly $7 profit per plant per 30s; first dealer in ~3-4 minutes.
All numbers live in one config file so they're easy to tune.

### Art style
Flat SVG drawn in code: plants (one shape per stage), dealers,
pots, stash and door. No image assets.

### Offline progress
On load, plants catch up from their timestamps and dealer trips that
ended while you were away are resolved. After 60 s or more away, a
"While you were away" summary shows the trip results, cash earned and
plants ready. No time cap for now: nothing piles up offline yet
(dealers don't leave on their own). Add a cap when automation arrives.
