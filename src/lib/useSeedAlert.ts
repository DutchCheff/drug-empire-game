import { useEffect, useRef } from 'react'

export function useSeedAlert(seedCount: number, enabled: boolean) {
    const previous = useRef(seedCount)

    useEffect(() => {
        const ranOut = previous.current > 0 && seedCount === 0
        previous.current = seedCount
        if (!ranOut || !enabled || !document.hidden) {
            return
        }
        if (!('Notification' in window) || Notification.permission !== 'granted') {
            return
        }
        new Notification('Out of seeds', {
            body: 'The gardener has no seeds left to plant.',
            icon: '/favicon.svg',
            tag: 'out-of-seeds',
        })
    }, [seedCount, enabled])
}
