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