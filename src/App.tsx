import { useState, useEffect, useReducer } from "react";
import { CONFIG } from "./game/config";
import { nextPotCost } from "./game/costs";
import { gameReducer } from "./game/state";
import { useNow } from "./game/useNow";
import { startGame } from './game/away'
import { saveGame } from './game/save'
import { Room } from "./components/Room";
import { Hotbar } from "./components/hotbar/Hotbar";
import { Hud } from "./components/Hud";
import { AwayModal } from "./components/AwayModal";
import { StashModal } from './components/StashModal'
import { TripToasts } from './components/TripToasts'
import { DevPanel } from './components/DevPanel'
import { sellPrice, totalCount } from "./game/strains";

function App() {
  const now = useNow()
  const [start] = useState(() => startGame(Date.now()))
  const [state, dispatch] = useReducer(gameReducer, start.state)
  const [awaySummary, setAwaySummary] = useState(start.summary)
  const [storeOpen, setStoreOpen] = useState(false)
  const [stashOpen, setStashOpen] = useState(false)

  useEffect(() => {
    saveGame({ ...state, savedAt: Date.now() })
    function handlePageHide() {
      saveGame({ ...state, savedAt: Date.now() })
    }
    window.addEventListener('pagehide', handlePageHide)
    return () => {
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [state])

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ type: 'tick', now: Date.now() })
    }, 250)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const potCost = nextPotCost(state.pots.length)
  const potsFull = state.pots.length >= CONFIG.maxPots
  const canBuyPot = !potsFull && state.cash >= potCost
  const canPlant = state.seeds[state.plantStrain] > 0
  const stashGrams = totalCount(state.stash)

  return (

    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Hud
        cash={state.cash}
        grams={stashGrams}
        sellPrice={sellPrice(state.stash)}
        onSell={() => dispatch({ type: 'sell', grams: 1 })}
        seeds={state.seeds}
        plantStrain={state.plantStrain}
        dock={state.dock}
        now={now}
        unlocked={state.unlocked}
        onBuySeeds={(strain, bundleIndex) => dispatch({ type: 'buySeeds', strain, bundleIndex })}
        onUnlock={(strain) => dispatch({ type: 'unlockStrain', strain })}
        storeOpen={storeOpen}
        onStoreOpen={setStoreOpen}
        onStashClick={() => setStashOpen(true)}
        onUnload={() => dispatch({ type: 'unloadPallet', now })}
        onPickStrain={(strain) => dispatch({ type: 'pickStrain', strain })}
      />

      <Room
        pots={state.pots}
        dealers={state.dealers}
        staff={state.staff}
        dock={state.dock}
        stash={stashGrams}
        cash={state.cash}
        now={now}
        potCost={potCost}
        canBuyPot={canBuyPot}
        canPlant={canPlant}
        onPotClick={(potId) => dispatch({ type: 'clickPot', potId, now })}
        onBuyPot={() => dispatch({ type: 'buyPot' })}
        onSendDealer={(dealerId, grams) => dispatch({ type: 'sendDealer', dealerId, grams, now })}
        onBuildDock={() => dispatch({ type: 'buildDock' })}
        onOrderPallet={(offerIndex) => dispatch({ type: 'orderPallet', offerIndex, now })}
        onUnloadPallet={() => dispatch({ type: 'unloadPallet', now })}
        onStashClick={() => setStashOpen(true)}
      />

      <Hotbar
        dealers={state.dealers}
        candidates={state.candidates}
        now={now}
        stash={state.stash}
        seeds={state.seeds}
        gardenerOrder={state.gardenerOrder}
        gardenerMode={state.gardenerMode}
        unlocked={state.unlocked}
        cash={state.cash}
        staff={state.staff}
        staffPaid={state.staffPaid}
        minStash={state.minStash}
        fullLoadsOnly={state.fullLoadsOnly}
        onSend={(dealerId, grams) => dispatch({ type: 'sendDealer', dealerId, grams, now })}
        onHire={(candidateIndex) => dispatch({ type: 'hireDealer', candidateIndex })}
        onHireStaff={(role) => dispatch({ type: 'hireStaff', role, now })}
        onToggleStaff={(role) => dispatch({ type: 'toggleStaff', role })}
        onMinStash={(grams) => dispatch({ type: 'setMinStash', grams })}
        onFullLoadsOnly={(value) => dispatch({ type: 'setFullLoadsOnly', value })}
        onMoveStrain={(strain, target) => dispatch({ type: 'moveStrain', strain, target })}
        onGardenerMode={(mode) => dispatch({ type: 'setGardenerMode', mode })}
        onOpenStore={() => setStoreOpen(true)}
        onTrain={(dealerId, skill) => dispatch({ type: 'trainDealer', dealerId, skill, now })}
      />

      {awaySummary !== null && <AwayModal summary={awaySummary} onClose={() => setAwaySummary(null)} />}
      {stashOpen && <StashModal stash={state.stash} unlocked={state.unlocked} onClose={() => setStashOpen(false)} />}
      <TripToasts dealers={state.dealers} dock={state.dock} now={now} />
      {import.meta.env.DEV && (
        <DevPanel
          cash={state.cash}
          stash={state.stash}
          unlocked={state.unlocked}
          onSet={(cash, strain, grams) => dispatch({ type: 'devSet', cash, strain, grams })}
          onRipenPots={() => dispatch({ type: 'devRipenPots', now })}
        />
      )}
    </main>
  )
}

export default App
