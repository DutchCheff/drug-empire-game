import { useState } from 'react'
import { GrowthRing, ReadyRing } from '../art/plants/GrowthRing'
import { HarvestPop } from '../art/plants/HarvestPop'
import { Plant } from '../art/plants/Plant'
import { TerracottaPot } from '../art/plants/Pot'
import { getProgress, getStage } from '../game/plants'
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
            aria-label={`Pot ${props.pot.id}: ${stage}`}
            className={`h-full w-full rounded-full ${clickable ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}`}
        >
            <svg viewBox="-56 -56 112 112" className="h-full w-full overflow-visible">
                <TerracottaPot />
                <Plant stage={stage} />
                {growing && <GrowthRing progress={progress} color={RING_COLORS[stage]} />}
                {stage === 'ready' && <ReadyRing />}
                {/* A new key restarts the animation on every harvest. */}
                {harvestCount > 0 && <HarvestPop key={harvestCount} />}
            </svg>
        </button>
    )
}