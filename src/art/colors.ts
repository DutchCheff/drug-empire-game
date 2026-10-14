export const PLANT = {
    leafDark: '#2E6A2B',
    leafMid: '#3F8B37',
    leafLight: '#5FAE45',
    leafNew: '#8CCB5E',
    leafLate: '#2C5F2A',
    leafLateMid: '#3A7A31',
    leafYellow: '#A3A43E',
    rib: '#21491E',
    stem: '#3D6B2A',
}

export type BudColors = {
    main: string
    shade: string
    light: string
    pistil: string
    sugar: string
}

export function mix(from: string, to: string, share: number) {
    const parse = (hex: string) => [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16))
    const start = parse(from)
    const end = parse(to)
    const channels = start.map((value, index) => Math.round(value + (end[index] - value) * share))
    return '#' + channels.map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()
}

export const ROOM = {
    outside: '#151311',
    street: '#36332F',
    streetLine: '#2C2A27',
    curb: '#4A4641',
    wallTop: '#433C36',
    wallEdge: '#1E1A17',
    floor: '#6E685F',
    floorLine: '#635D55',
    threshold: '#57514A',
    door: '#8B5E3C',
    doorShade: '#6E482C',
    apron: '#2B2825',
    laneLine: 'rgba(236,230,218,0.22)',
    hazardDark: '#2A2622',
    hazardGold: '#C99A2E',
    rollerRib: '#44484E',
    rollerEdge: '#2A2C30',
    bollard: '#E9B949',
    bollardShade: '#B88E2A',
    bay: 'rgba(233,185,73,0.7)',
}

export const DOCK_ART = {
    pallet: '#A88454',
    palletShade: '#7C5F38',
    crate: '#9A6B40',
    crateShade: '#6E482C',
    crateSlat: '#86593A',
    packet: '#E3D3A9',
    packetEdge: '#BFAE82',
    packetBand: '#CDBB8D',
    ring: '#E9B949',
}

export const VAN = {
    body: '#D9D4CA',
    shade: '#A8A296',
    roof: '#E8E4DC',
    rib: '#C9C3B6',
    glass: '#2A3440',
    mirror: '#5A5E65',
    cargo: '#2A2622',
}
