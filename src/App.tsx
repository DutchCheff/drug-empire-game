import { useEffect, useReducer } from "react";
import { CONFIG } from "./game/config";
import { nextPotCost } from "./game/costs";
import { createInitialState, gameReducer } from "./game/state";
import { useNow } from "./game/useNow";
import { loadGame, saveGame } from "./game/save";
import { Room } from "./components/Room";
import { Hud } from "./components/Hud";
function App() {
  const now = useNow()
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    return loadGame() ?? createInitialState(Date.now())
  })

  useEffect(() => {
    saveGame({ ...state, savedAt: Date.now() })
  }, [state])

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
        onSellAll={() => dispatch({ type: 'sell', grams: state.grams })}
      />

      <Room
        pots={state.pots}
        now={now}
        potCost={potCost}
        canBuyPot={canBuyPot}
        canPlant={canPlant}
        onPotClick={(potId) => dispatch({ type: 'clickPot', potId, now })}
        onBuyPot={() => dispatch({ type: 'buyPot' })}
      />
    </main>
  )
}

export default App
