import { Fragment } from "react/jsx-runtime";
import type { DealerStats } from "../../game/types";

function percent(value: number) {
    return `${(value * 100).toFixed(value < 0.1 ? 1 : 0)}%`
}

type DealerStatsListProps = {
    stats: DealerStats
}

export function DealerStatsList(props: DealerStatsListProps) {
        const rows = [
        ['Carries', `${props.stats.capacity} g`],
        ['Cut', percent(props.stats.cut)],
        ['Robbery', percent(props.stats.robberyChance)],
        ['Arrest', percent(props.stats.arrestChance)],
    ]
    return (
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-sm">
            {rows.map((row) => (
                <Fragment key={row[0]}>
                    <dt className="text-muted">{row[0]}</dt>
                    <dd className="text-right font-mono">{row[1]}</dd>
                </Fragment>
            ))}
        </dl>
    )
}