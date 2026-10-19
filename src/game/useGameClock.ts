import { useEffect, useState, type Dispatch } from 'react'
import type { GameAction } from './state'

export function useGameClock(dispatch: Dispatch<GameAction>, intervalMs = 250) {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const timer = setInterval(() => {
            const time = Date.now()
            setNow(time)
            dispatch({ type: 'tick', now: time })
        }, intervalMs)
        return () => {
            clearInterval(timer)
        }
    }, [dispatch, intervalMs])

    return now
}
