import { useReducer } from "react";
import { CONFIG } from "./game/config";
import { getProgress, getStage } from "./game/plants";
import { createInitialState, gameReducer } from "./game/state";
import { useNow } from "./game/useNow";

function App() {
  const now = useNow()
  const [state, dispatch] = useReducer(gameReducer, null, () => {
    return createInitialState(Date.now())
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">DRUG EMPIRE</h1>
      <p className="font-mono text-xl text-gold">
        ${state.cash} · {state.grams} g
      </p>

      <div className="grid grid-cols-2 gap-3">
        {state.pots.map((pot) => {
          const stage = getStage(pot, now)
          const percent = Math.round(getProgress(pot, now) * 100)
          const border =
            stage === 'ready' ? 'border-gold' : 'border-edge'
          return (
            <button
              key={pot.id}
              type="button"
              onClick={() => 
                dispatch({ type: 'clickPot', potId: pot.id, now})
              }
              className={`flex h-24 w-40 flex-col items-center justify-center gap-1 rounded-xl border-2 bg-panel ${border}`}
            >
              <span className="font-semibold">{stage}</span>
              <span className="font-mono text-sm text-muted">
                {percent}%
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'sell', grams: 1 })}
        className="h-11 rounded-lg bg-leaf px-4 font-semibold text-ink"
      >
        Sell 1 g · ${CONFIG.pricePerGram}
      </button>
    </main>
  )
}

export default App
