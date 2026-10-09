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
import { TripToasts } from './components/TripToasts'
import { DevPanel } from './components/DevPanel'

function App() {
  const now = useNow()
  const [start] = useState(() => startGame(Date.now()))
  const [state, dispatch] = useReducer(gameReducer, start.state)
  const [awaySummary, setAwaySummary] = useState(start.summary)

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
  const canPlant = state.cash >= CONFIG.seedCost

  return (

    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Hud
        cash={state.cash}
        grams={state.grams}
        onSell={() => dispatch({ type: 'sell', grams: 1 })}
      />

      <Room
        pots={state.pots}
        dealers={state.dealers}
        stash={state.grams}
        now={now}
        potCost={potCost}
        canBuyPot={canBuyPot}
        canPlant={canPlant}
        onPotClick={(potId) => dispatch({ type: 'clickPot', potId, now })}
        onBuyPot={() => dispatch({ type: 'buyPot' })}
        onSendDealer={(dealerId, grams) => dispatch({ type: 'sendDealer', dealerId, grams, now })}
      />

      <Hotbar
        dealers={state.dealers}
        candidates={state.candidates}
        now={now}
        stash={state.grams}
        cash={state.cash}
        onSend={(dealerId, grams) => dispatch({ type: 'sendDealer', dealerId, grams, now })}
        onHire={(candidateIndex) => dispatch({ type: 'hireDealer', candidateIndex })}
      />

      {awaySummary !== null && <AwayModal summary={awaySummary} onClose={() => setAwaySummary(null)} />}
      <TripToasts dealers={state.dealers} now={now} />
      {import.meta.env.DEV && (
        <DevPanel
          cash={state.cash}
          grams={state.grams}
          onSet={(cash, grams) => dispatch({ type: 'devSet', cash, grams })}
          onRipenPots={() => dispatch({ type: 'devRipenPots', now })}
        />
      )}
    </main>
  )
}

export default App
