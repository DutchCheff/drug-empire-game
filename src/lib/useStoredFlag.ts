import { useState } from 'react'

function readFlag(key: string) {
    try {
        return localStorage.getItem(key) === 'on'
    } catch {
        return false
    }
}

export function useStoredFlag(key: string) {
    const [value, setValue] = useState(() => readFlag(key))

    function update(next: boolean) {
        setValue(next)
        try {
            localStorage.setItem(key, next ? 'on' : 'off')
        } catch {
            // Storage blocked: the setting only lasts this session.
        }
    }

    return [value, update] as const
}
