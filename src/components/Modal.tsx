import { useEffect, useId, type ReactNode } from "react";

const WIDTHS = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
}

type ModalProps = {
    title: string
    subtitle?: string
    size: keyof typeof WIDTHS,
    headerExtra?: ReactNode
    onClose: () => void
    children: ReactNode
}

export function Modal(props: ModalProps) {
    const titleId = useId()
    const onClose = props.onClose

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-6"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    props.onClose()
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`flex max-h-full w-full flex-col gap-4 overflow-y-auto rounded-xl border border-edge bg-panel p-6 shadow-2xl ${WIDTHS[props.size]}`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 id={titleId} className="text-xl font-bold">
                            {props.title}
                        </h2>
                        {props.subtitle && <p className="text-muted">{props.subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                        {props.headerExtra}
                        <button type="button" onClick={props.onClose} className="cursor-pointer p-1 text-muted hover:text-paper">
                            Close
                        </button>
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    )
}