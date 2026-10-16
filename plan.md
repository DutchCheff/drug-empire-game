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
- Dealers improve through training (see Dealer training), not gear.
- Every dealer has their own look (25 looks); a hire candidate already shows it.

## Store
- Store button in the top bar opens a store panel.
- **Seeds**: 1 seed $5, bundle of 10 for $40. Seeds go into a stock
  (shown in the top bar). Planting uses 1 seed from stock; with no seeds
  an empty pot can't be planted (click shows "No seeds, open the store").
- New game starts with 4 seeds and $20.
- Tabs: Seeds, Strains, Grow gear (see Grow gear). The Dealer gear tab is
  dropped: dealers improve through training.

## Dealer training
Design: canvas board "Crew and training". Numbers are proposals.
- **Crew modal**: table of all hired dealers (status, carry, cut, robbery,
  arrest, ranks n/20, running training). Click a row for that dealer's four
  skills: next rank's effect before → after, price, duration, Train.
  Opens from a Crew tile after Hire in the Dealers tab (shows "n training")
  and from the dealer modal ("Train ›" / "Crew ›" link under the stats).
- **Rules**: paid in cash up front, then a timer. One skill per dealer at a
  time; no cancel, no rush. The dealer keeps working while training. Jail
  pauses the timer. It runs offline (within the 2-hour cap). Skills stay for
  good, also after jail. New hires start untrained.
- **Skills**, 5 ranks each, every rank ×2 the previous in cash and time:

| Skill         | Effect per rank                    | Cost rank 1 → 5 | Time rank 1 → 5 |
|---------------|------------------------------------|-----------------|-----------------|
| Strength      | +3 g carry capacity                | $100 → $1,600   | 30 s → 8 min    |
| Stealth       | −15% of base arrest chance         | $150 → $2,400   | 45 s → 12 min   |
| Street smarts | −15% of base robbery chance        | $150 → $2,400   | 45 s → 12 min   |
| Loyalty       | −2 points cut, never below 5%      | $250 → $4,000   | 1 min → 16 min  |

- Shown stats everywhere (dealer modal, Send payout, runner choice) include
  trained ranks.
- Training ring on the dealer tile (grey when paused in jail); toast
  "Dre finished Strength 2", also for ranks finished while away.

## Grow gear
Design: canvas boards "Store grow gear" and "Lamp and fertilizer".
- **Grow lamp**: bought one at a time; hangs over one pot, that pot grows
  25% faster. First lamp $150, every next ×1.5. Max one per pot. The store
  row shows owned · placed · available and pots without a lamp; "No free
  pots for a lamp" when every pot has one.
- **Placing mode**: starts after buying a lamp, or from the lamp chip in the
  top bar (only while lamps are available or placing). Banner over the room
  with Done (or Escape). Pots without a lamp show a dashed lamp slot; lamps
  show × to take them back. Moving = take back, then hang elsewhere.
- **Fertilizer**: bags, 1 for $20 · 10 for $160 · 50 for $750. One bag per
  planting: +40% yield on that harvest; granules and a tag on the pot until
  harvest. By hand when the bag chip in the top bar is on; by the gardener
  when his Fertilizer switch is on. Out of bags: planting goes on without,
  the chip shows "out", the gardener's switch turns off, one toast.
- **Dock**: the Fertilizer pallet row in Bulk order becomes active
  (100 bags; proposal $1,500, 60 s).

## Gardener upgrades
Design: canvas board "Gardener upgrades". The gardener modal gets two
tabs: Planting (what to plant + Fertilizer switch) and Upgrades.
- **Movement speed**: 3 levels, each 25% faster walking and tending:
  $500, $1,500, $4,500 (walk 1.2 → 0.96 → 0.77 → 0.61 s, tend 2 → 1.6 →
  1.28 → 1.02 s). Header line follows the level. Gold dot on the tab when
  the next level is affordable.
- Soon rows: Green thumb (more yield), Second gardener.

## Strains
Design: canvas board "Strains". Classic plus seven strains. Bloom buds are
plain green for every strain (only the leaves differ); the colours show when
ripe. Classic becomes duller than now: no frost, no sparkle.

| Strain             | Type   | Grow | Yield | Price/g | Seed | Unlock  | Role             |
|--------------------|--------|------|-------|---------|------|---------|------------------|
| Classic            | –      | 30 s | 5 g   | $4      | $5   | start   | Starter          |
| Northern Lights    | Indica | 24 s | 5 g   | $4      | $6   | $500    | Clicker (fast)   |
| Blue Dream         | Hybrid | 36 s | 8 g   | $4      | $8   | $1,000  | Bulk             |
| Sour Diesel        | Sativa | 40 s | 7 g   | $6      | $12  | $2,000  | All-rounder      |
| OG Kush            | Hybrid | 30 s | 5 g   | $7      | $12  | $3,000  | Drop-in upgrade  |
| Granddaddy Purple  | Indica | 45 s | 7 g   | $8      | $16  | $5,000  | Idle             |
| Girl Scout Cookies | Hybrid | 50 s | 5 g   | $13     | $18  | $8,000  | Dealer favourite |
| Gorilla Glue #4    | Hybrid | 60 s | 9 g   | $10     | $25  | $12,000 | Big idle         |

- **Unlock**: pay once, in order, in the store's Strains tab.
- **Roles** instead of a strict curve: dealer capacity caps grams, so pricey
  grams earn more per trip; the gardener tends one pot at a time, so slow
  strains suit him. Later: gardener speed upgrades, heat, hash press.
- **Stash per strain**: dealer loads, the runner and "Sell 1 g" always take
  the most expensive grams first. A dealer remembers the street value of
  their load; payout = value × (1 − cut).
- **Seeds per strain**: Classic 1 / 10 / 100, other strains 1 / 10 / 50;
  10 at 20% off, 50 and 100 at 25% off. Dock pallets stay Classic for now.
- **Planting by hand**: strain picker on the Seeds counter in the top bar;
  clicking an empty pot plants the picked strain.
- **Gardener** (canvas board "Gardener modal", option B): "What to plant"
  with three modes. Best value (default): the strain with seeds that earns
  the most per pot per second, (yield × price − seed) / grow time. Fastest:
  shortest grow time with seeds. My order: his own priority list (drag, or
  put first in one tap; strains without seeds fold away). A "Plants next"
  card shows his pick; with no seeds a card links to the store. With only
  Classic unlocked there is nothing to choose, so the modes are hidden.
- Old saves: pots, seeds and grams become Classic.

## Loading dock (first building expansion)
Design: canvas board "Loading dock" and the van in "Full game · vision".
The apartment's first expansion slot; the warehouse later gets a bigger dock.

- **Where**: a roller door in the right wall at the bottom row, with a
  driveway outside it (hazard stripes, bollards, dashed bay inside the door).
  Dealers keep using the front door, so the two flows don't cross.
- **Slot**: before it's built, a dashed slot with a lock: "Dock · $400".
- **Flow**: click the dock door → Bulk order panel → order (paid now). A timer
  ring sits in the bay, the van drives in along the street and backs in, the
  door rolls up and the pallet waits with a gold ring. Click the pallet (or
  the "Unload" chip in the top bar) → everything goes to stock, "+250 seeds"
  floats up, the van drives off.
- **Orders**: one van, one order at a time.

| Pallet        | Contents         | Price  | Each  | Van  |
|---------------|------------------|--------|-------|------|
| Seed crate    | 250 seeds        | $800   | $3.20 | 60 s |
| Seed pallet   | 1,000 seeds      | $3,000 | $3.00 | 90 s |
| Fertilizer    | 20 bags (Soon)   |        |       | 60 s |
| Lab supplies  | 10 crates (Soon) |        |       | 90 s |

- Top-bar chip while an order runs: van icon + countdown, "Unload" when in.
- Toasts: "Van on the way · 1:00", "Van at the dock · unload the pallet",
  "Unloaded · +250 seeds".
- **Offline**: the van arrives offline too; the pallet waits for you and the
  away summary says "Van waiting at the dock".
- **Later on the same dock**: fertilizer pallets (with grow gear), supplier
  crates (coke), lab supplies. Auto-restock idea: the runner unloads and
  reorders below a seed threshold, so the gardener keeps working while away.

## Staff (automation)
- Staff cost a one-time hire fee plus a wage per minute, paid from cash.
  When cash can't cover the wage, staff stop working until it can.
- **Gardener**: plants empty pots (uses seeds from stock) and harvests
  ripe plants, one action every few seconds. Setting: on/off.
  Proposed: hire $150, wage $2/min.
- **Runner**: hands product to idle dealers automatically. Settings:
  on/off, minimum stash to keep (default 20 g); everything above that is
  given out, each dealer filled up to their capacity. Of the dealers waiting
  in the room, the runner first picks the one that earns you the most:
  load (capacity, or what's left above the minimum) × (1 − cut).
  Proposed: hire $250, wage $3/min.
- Staff walk around in the room like dealers (art step after the logic).
- Later: more/faster staff, rules per dealer (e.g. only dealers with a low cut).

## Offline with automation
On load the game replays the time away in 0.5 s steps (gardener, runner,
dealer trips, wages), capped at 2 hours. Time beyond the cap is skipped:
plants, trips and paydays are moved forward so nothing happens in it.
The "While you were away" summary shows trips sold / robbed / arrested,
plants harvested, loads sent, wages paid and the net cash change.

## Implemented
- Plants: seed → seedling → vegetative → flowering → ready (10 s per stage),
  growth ring, harvest pop, sway and sparkles.
- Room: 3×3 pot slots (start with 4, buy up to 9), stash table that fills up,
  door, street.
- Top bar: cash, stash, seeds, Store, Sell 1 g.
- Modal shell for every panel (Escape / backdrop closes).
- Store modal: seeds 1 / 10 / 100 with price per seed and savings; other
  tabs marked "Soon". Planting uses seed stock.
- Dealers: 3 candidates with random stats, hire fee by quality (max 6),
  Send modal with amount and expected payout, full load by clicking a dealer
  in the room, trips with sold / robbed / arrested, jail time, walking
  sprites, portraits.
- Tabbed hotbar: Dealers, Growers, Runners (slides open and closed).
- Staff: hire fee + wage per minute, unpaid state, Staff modal with
  Pause/Resume. Gardener walks to a pot, harvests and replants it right
  away. Runner keeps a minimum stash and sends the best-paying idle dealer.
  Both visible in the room.
- Offline replay with the 2-hour cap; away summary shows staff work and wages.
- Loading dock: build slot, bulk order panel, van drive-in and drive-off,
  pallet unload, top-bar chip, dock toasts, offline arrival.
- Trip toasts with the strains in the load ("9 g Sour Diesel · 6 g
  Classic"), "While you were away" summary, save in localStorage.
- Stash modal: opens from the Stash counter or the stash table; mix bar,
  grams / price / value per unlocked strain in sell order, total.
- Store rows on fixed columns (Seeds: name + three 7.5rem buttons;
  Strains: name, stats 14rem, action 10rem).
- Strains: 8 strains with their own art, grow time, yield and price;
  unlock in order in the store, seed bundles per strain, stash and seeds
  per strain (most expensive grams sold first), strain picker in the top
  bar, gardener planting modes (Best value / Fastest / My order).
- Dealer training: Crew modal (table + skills, Train), Crew tile, training
  ring on dealer tiles, training line in the dealer modal, "finished" toast
  and away-summary lines; timer pauses in jail and runs offline.
- Dev panel (dev only): set cash and grams, ripen all pots.

## Roadmap (implementation, in order)
1. Gardener upgrades: modal tabs, movement speed.
2. Grow gear:
   a. Grow lamps: buying, placing mode, lamp art, faster growth.
   b. Fertilizer: bags, bag chip, gardener switch, pot marker, +yield.
   c. Fertilizer pallet at the dock.
3. Dock auto-restock (runner unloads and reorders below a threshold).
4. Later: police heat, bigger buildings (warehouse, see canvas), prestige.

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
