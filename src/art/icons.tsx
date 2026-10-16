type IconProps = {
    className?: string
}

export function CashIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
            aria-hidden="true"
        >
            <rect x={3} y={6} width={18} height={12} rx={2} />
            <circle cx={12} cy={12} r={2.5} />
        </svg>
    )
}

export function GramsIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
            aria-hidden="true"
        >
            <path d="M6 4 H18 V19 A1 1 0 0 1 17 20 H7 A1 1 0 0 1 6 19 Z" />
            <path d="M6 8 H18" />
        </svg>
    )
}


export function SeedIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
            aria-hidden="true"
        >
            <path d="M12 3 C17 7 17 15 12 21 C7 15 7 7 12 3 Z" />
            <path d="M12 8 V16" />
        </svg>
    )
}
export function VanIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
            aria-hidden="true"
        >
            <path d="M2 7 H15 V17 H2 Z" />
            <path d="M15 10 H19 L22 13 V17 H15" />
            <circle cx={6} cy={18} r={1.6} />
            <circle cx={18} cy={18} r={1.6} />
        </svg>
    )
}

export function TrainIcon(props: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
            aria-hidden="true"
        >
            <path d="M4 9 V15 M7 7 V17 M17 7 V17 M20 9 V15 M7 12 H17" />
        </svg>
    )
}
