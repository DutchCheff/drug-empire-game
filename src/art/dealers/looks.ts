export type DealerLook = {
    head: 'hood' | 'cap' | 'beanie' | 'hair' | 'bucket'
    top: string
    topShade: string
    skin: string
    shoes: string
    hat?: string
    hatShade?: string
    pom?: string
    hair?: string
    stripe?: string
    puffer?: boolean
}

export const DEALER_LOOKS: DealerLook[] = [
    { head: 'hood', top: '#3D5F8F', topShade: '#2E4A70', skin: '#F0C6A0', shoes: '#E8E4DC' },
    {
        head: 'cap',
        top: '#B23A48',
        topShade: '#8C2C38',
        skin: '#8D5A3B',
        shoes: '#1E1E1E',
        hat: '#232326',
        hatShade: '#121214',
        stripe: '#F2EDE4',
    },
    {
        head: 'beanie',
        top: '#5B713D',
        topShade: '#46592E',
        skin: '#C68B59',
        shoes: '#5A3B24',
        hat: '#E07A2E',
        hatShade: '#B8611F',
        pom: '#F4AE66',
    },
    {
        head: 'hair',
        top: '#E3A93C',
        topShade: '#BF8A28',
        skin: '#5C3A21',
        shoes: '#F2EDE4',
        hair: '#1A1410',
        puffer: true,
    },
    {
        head: 'bucket',
        top: '#2E2E33',
        topShade: '#1D1D21',
        skin: '#E8B48C',
        shoes: '#C84B4B',
        hat: '#D8D0BE',
        hatShade: '#B9B09C',
    },
]

export function lookFor(dealerId: number) {
    return DEALER_LOOKS[(dealerId - 1) % DEALER_LOOKS.length]
}