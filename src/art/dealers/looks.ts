import { mix } from '../colors'

export type DealerLook = {
    head:
        | 'hood'
        | 'cap'
        | 'beanie'
        | 'hair'
        | 'bucket'
        | 'durag'
        | 'afro'
        | 'bald'
        | 'mohawk'
        | 'snapback'
        | 'headphones'
        | 'ponytail'
        | 'bandana'
        | 'cornrows'
        | 'beret'
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
    chain?: boolean
    shades?: boolean
    camo?: string
}

const SKIN = { light: '#F0C6A0', fair: '#E8B48C', tan: '#C68B59', brown: '#8D5A3B', dark: '#5C3A21' }

function shade(color: string) {
    return mix(color, '#000000', 0.22)
}

function look(
    top: string,
    skin: string,
    shoes: string,
    head: DealerLook['head'],
    extra: Partial<DealerLook> = {},
): DealerLook {
    const hatShade = extra.hatShade ?? (extra.hat === undefined ? undefined : shade(extra.hat))
    return { head, top, topShade: shade(top), skin, shoes, ...extra, hatShade }
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
    look('#2E2E33', SKIN.brown, '#E8E4DC', 'durag', { hat: '#B23A48' }),
    look('#E07A2E', SKIN.dark, '#2E2E33', 'afro', { hair: '#1A1410', chain: true }),
    look('#2E2E33', SKIN.fair, '#C84B4B', 'bald', { shades: true, chain: true }),
    look('#3D5F8F', SKIN.light, '#1E1E1E', 'mohawk', { hair: '#9C6BC0' }),
    look('#5B713D', SKIN.tan, '#F2EDE4', 'snapback', { hat: '#E9B949', stripe: '#F2EDE4' }),
    look('#7FA7C9', SKIN.light, '#2E2E33', 'headphones', { hair: '#6B4A2E', hat: '#2E2E33', hatShade: '#121214' }),
    look('#3F8B37', SKIN.light, '#E8E4DC', 'ponytail', { hair: '#B8611F', hat: '#E9B949', stripe: '#ECE6DA' }),
    look('#D8D0BE', SKIN.brown, '#5A3B24', 'bandana', { hat: '#3D5F8F', hatShade: '#ECE6DA' }),
    look('#B23A48', SKIN.dark, '#F2EDE4', 'cornrows', { hair: '#1A1410', puffer: true }),
    look('#8A5A35', SKIN.fair, '#1E1E1E', 'beret', { hat: '#2E2E33' }),
    look('#5B713D', SKIN.tan, '#3B3330', 'hood', { camo: '#3F5230' }),
    look('#8A8F96', SKIN.dark, '#E8E4DC', 'hood', { chain: true }),
    look('#2E2E33', SKIN.light, '#F2A3C7', 'cap', { hat: '#F2A3C7', stripe: '#F2A3C7' }),
    look('#1E1E1E', SKIN.dark, '#E9B949', 'beanie', { hat: '#3F8B37', pom: '#E9B949' }),
    look('#6E685F', SKIN.fair, '#2E2E33', 'bucket', { hat: '#5B713D', camo: '#4B4640' }),
    look('#9FC3D6', SKIN.light, '#ECE6DA', 'hair', { hair: '#E3D36A', puffer: true }),
    look('#ECE6DA', SKIN.dark, '#1E1E1E', 'bald', { chain: true }),
    look('#2A3440', SKIN.brown, '#ECE6DA', 'snapback', { hat: '#C24F3A', stripe: '#ECE6DA' }),
    look('#2E2E33', SKIN.tan, '#E9B949', 'durag', { hat: '#ECE6DA', hatShade: '#B9B09C', shades: true, chain: true }),
    look('#3B3330', SKIN.tan, '#1E1E1E', 'ponytail', { hair: '#1A1410', hat: '#C24F3A', shades: true }),
]

export function lookFor(look: number) {
    return DEALER_LOOKS[look] ?? DEALER_LOOKS[0]
}
