import { useState } from 'react'
import { GrowthRing, ReadyRing } from '../art/plants/GrowthRing'
import { HarvestPop } from '../art/plants/HarvestPop'
import { Plant } from '../art/plants/Plant'
import { TerracottaPot } from '../art/plants/Pot'
import { getStrain } from '../game/strains'
import { getProgress, getStage, growSeconds } from '../game/plants'
import type { PlantStage, Pot } from '../game/types'

const RING_COLORS: Record<PlantStage, string> = {
    empty: 'transparent',
    seedling: '#9BD36A',
    vegetative: '#6BBF4E',
    flowering: '#E9B949',
    ready: '#E9B949',
}

type PotButtonProps = {
    pot: Pot
    now: number
    canPlant: boolean
    onClick: () => void
}

export function PotButton(props: PotButtonProps) {
    const [harvestCount, setHarvestCount] = useState(0)
    const stage = getStage(props.pot, props.now)
    const progress = getProgress(props.pot, props.now)
    const growing = stage !== 'empty' && stage !== 'ready'
    const clickable = stage === 'ready' || (stage === 'empty' && props.canPlant)
    const strainName = getStrain(props.pot.strain).name
    const timeLeft = stage === 'ready' ? 'ready' : `${Math.ceil(growSeconds(props.pot) * (1 - progress))} s left`

    function handleClick() {
        if (stage === 'ready') {
            setHarvestCount(harvestCount + 1)
        }
        props.onClick()
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={stage === 'empty' ? `Pot ${props.pot.id}: empty` : `Pot ${props.pot.id}: ${strainName}, ${timeLeft}`}
            className={`group relative h-full w-full rounded-full ${clickable ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}`}
        >
            {stage !== 'empty' && (
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 rounded-md border border-edge bg-panel px-2 py-1 text-xs whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    <span className="font-semibold">{strainName}</span>{' '}
                    <span className={`font-mono ${stage === 'ready' ? 'text-gold' : 'text-muted'}`}>· {timeLeft}</span>
                </span>
            )}
            <svg viewBox="-56 -56 112 112" className="h-full w-full overflow-visible">
                <TerracottaPot />
                <Plant stage={stage} strain={props.pot.strain} />
                {growing && <GrowthRing progress={progress} color={RING_COLORS[stage]} />}
                {stage === 'ready' && <ReadyRing />}
                {/* A new key restarts the animation on every harvest. */}
                {harvestCount > 0 && <HarvestPop key={harvestCount} grams={getStrain(props.pot.strain).yieldGrams} />}
            </svg>
        </button>
    )
}