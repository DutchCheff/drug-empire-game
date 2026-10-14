import type { StrainId } from '../../game/types'
import type { BudColors } from '../colors'
import type { LeafletCount } from './Leaf'

export type StrainLook = {
    leafDark: string
    leafMid: string
    accent: string
    rib: string
    stem: string
    leafWidth: number
    leaflets: LeafletCount
    outerLength: number
    outerCount: number
    bud: BudColors
    frost: number
    pistils: number
    centerRadius: number
    sideCount: number
    sideRadius: number
    sideDistance: number
    sparkles: number
    packet: string
}

export const FLOWERING_BUD: BudColors = {
    main: '#A9C86B',
    shade: '#8DAE52',
    light: '#C3DC86',
    pistil: '#E2873B',
    sugar: '#5E9A40',
}

export const SPARKLE_SPOTS = [
    { x: -14, y: -20, size: 4 },
    { x: 20, y: -6, size: 3 },
    { x: -6, y: 22, size: 3.4 },
    { x: 8, y: -2, size: 2.6 },
    { x: -22, y: 6, size: 3 },
    { x: 16, y: 18, size: 3.2 },
]

const RIB = '#21491E'
const STEM = '#3D6B2A'

export const STRAIN_LOOKS: Record<StrainId, StrainLook> = {
    classic: {
        leafDark: '#2E6A2B',
        leafMid: '#3F8B37',
        accent: '#A3A43E',
        rib: RIB,
        stem: STEM,
        leafWidth: 0.19,
        leaflets: 7,
        outerLength: 30,
        outerCount: 7,
        bud: { main: '#B5C784', shade: '#98AC6A', light: '#C9D79A', pistil: '#A85A2E', sugar: '#5E8E40' },
        frost: 0,
        pistils: 1.4,
        centerRadius: 9.5,
        sideCount: 6,
        sideRadius: 5.2,
        sideDistance: 18,
        sparkles: 0,
        packet: '#CDBB8D',
    },
    northernLights: {
        leafDark: '#244F29',
        leafMid: '#2F6630',
        accent: '#5E7A34',
        rib: '#183A1C',
        stem: '#33592A',
        leafWidth: 0.28,
        leaflets: 5,
        outerLength: 25,
        outerCount: 7,
        bud: { main: '#DCE7C6', shade: '#BCCDA2', light: '#F3F7E6', pistil: '#D9A05B', sugar: '#7FA65A' },
        frost: 2,
        pistils: 1,
        centerRadius: 11.5,
        sideCount: 6,
        sideRadius: 6.4,
        sideDistance: 15,
        sparkles: 3,
        packet: '#E8EEE0',
    },
    blueDream: {
        leafDark: '#285A52',
        leafMid: '#336E63',
        accent: '#7F9A62',
        rib: '#1A4038',
        stem: '#2F5F55',
        leafWidth: 0.2,
        leaflets: 7,
        outerLength: 31,
        outerCount: 8,
        bud: { main: '#BAD4CA', shade: '#97B7AD', light: '#DDECE6', pistil: '#DB8C4B', sugar: '#5E9488' },
        frost: 1,
        pistils: 1.4,
        centerRadius: 10.5,
        sideCount: 8,
        sideRadius: 5.6,
        sideDistance: 19,
        sparkles: 2,
        packet: '#9FC3D6',
    },
    sourDiesel: {
        leafDark: '#4C7A2B',
        leafMid: '#5D8F34',
        accent: '#B8AC3A',
        rib: '#2F5418',
        stem: '#557A2C',
        leafWidth: 0.1,
        leaflets: 7,
        outerLength: 37,
        outerCount: 6,
        bud: { main: '#D8E27C', shade: '#BCC75E', light: '#EEF2B2', pistil: '#CB762F', sugar: '#93A83E' },
        frost: 0.6,
        pistils: 1.6,
        centerRadius: 7,
        sideCount: 8,
        sideRadius: 3.8,
        sideDistance: 24,
        sparkles: 1,
        packet: '#E3D36A',
    },
    ogKush: {
        leafDark: '#2E6A2B',
        leafMid: '#3F8B37',
        accent: '#A3A43E',
        rib: RIB,
        stem: STEM,
        leafWidth: 0.19,
        leaflets: 7,
        outerLength: 29,
        outerCount: 7,
        bud: { main: '#C3DD6E', shade: '#A3C256', light: '#DEEEA2', pistil: '#F07A28', sugar: '#7DAA3E' },
        frost: 1,
        pistils: 2.6,
        centerRadius: 10,
        sideCount: 6,
        sideRadius: 5.4,
        sideDistance: 18,
        sparkles: 2,
        packet: '#9CCB5A',
    },
    granddaddyPurple: {
        leafDark: '#36452F',
        leafMid: '#41553A',
        accent: '#6E4E8A',
        rib: '#25301F',
        stem: '#3E4A33',
        leafWidth: 0.26,
        leaflets: 5,
        outerLength: 26,
        outerCount: 7,
        bud: { main: '#9C6BC0', shade: '#7B4E9E', light: '#C3A0DD', pistil: '#E9A04A', sugar: '#5E3E7E' },
        frost: 1.2,
        pistils: 1.2,
        centerRadius: 11,
        sideCount: 6,
        sideRadius: 6,
        sideDistance: 16,
        sparkles: 3,
        packet: '#9C6BC0',
    },
    girlScoutCookies: {
        leafDark: '#22432A',
        leafMid: '#2B5532',
        accent: '#5C4A6E',
        rib: '#152C1A',
        stem: '#2B4A2C',
        leafWidth: 0.23,
        leaflets: 5,
        outerLength: 27,
        outerCount: 7,
        bud: { main: '#B8CA8C', shade: '#7F5F8F', light: '#DDE6C2', pistil: '#C96B3A', sugar: '#4E3E5E' },
        frost: 1.6,
        pistils: 1.2,
        centerRadius: 9,
        sideCount: 5,
        sideRadius: 5.4,
        sideDistance: 17,
        sparkles: 3,
        packet: '#C9A27A',
    },
    gorillaGlue: {
        leafDark: '#2D5A2C',
        leafMid: '#386D34',
        accent: '#9A9A44',
        rib: RIB,
        stem: STEM,
        leafWidth: 0.2,
        leaflets: 7,
        outerLength: 30,
        outerCount: 7,
        bud: { main: '#E5E9D4', shade: '#C7CEB0', light: '#F8F9EF', pistil: '#A9592B', sugar: '#E2E7D2' },
        frost: 4,
        pistils: 1,
        centerRadius: 10.5,
        sideCount: 7,
        sideRadius: 5.8,
        sideDistance: 18,
        sparkles: 6,
        packet: '#7A7F86',
    },
}
