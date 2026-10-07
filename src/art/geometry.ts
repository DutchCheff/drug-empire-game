// Point `distance` away from the center, `degrees` clockwise from straight up.
export function polar(degrees: number, distance: number) {
    const radians = (degrees * Math.PI) / 180
    return { x: Math.sin(radians) * distance, y: -Math.cos(radians) * distance }
}

// Short clockwise arc on a circle around the center.
export function arcPath(radius: number, fromDegrees: number, toDegrees: number) {
    const from = polar(fromDegrees, radius)
    const to = polar(toDegrees, radius)
    return `M${from.x} ${from.y} A${radius} ${radius} 0 0 1 ${to.x} ${to.y}`
}