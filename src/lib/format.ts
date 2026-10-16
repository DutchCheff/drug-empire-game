export function percent(value: number) {
    return `${(value * 100).toFixed(value < 0.1 ? 1 : 0)}%`
}