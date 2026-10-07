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
    frost: boolean
}

export const BUDS: Record<'flowering' | 'ripe', BudColors> = {
    flowering: {
        main: '#A9C86B',
        shade: '#8DAE52',
        light: '#C3DC86',
        pistil: '#E2873B',
        sugar: '#5E9A40',
        frost: false,
    },
    ripe: {
        main: '#D2DFA4',
        shade: '#B3C784',
        light: '#E9F0CC',
        pistil: '#B85E2A',
        sugar: '#6FA14C',
        frost: true,
    },
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
}
