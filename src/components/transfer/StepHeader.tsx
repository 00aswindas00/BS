import type { ReactNode } from 'react'

export function StepHeader({
  step,
  title,
  children,
  isLast = false,
  enabled = true,
}: {
  step: number
  title: string
  children: ReactNode
  isLast?: boolean
  enabled?: boolean
}) {
  return (
    <div className={`relative flex gap-4 pb-10 ${enabled ? '' : 'opacity-45'}`}>
      {!isLast && (
        <div
          className={`absolute left-[11px] top-7 h-[calc(100%-12px)] w-px ${
            enabled ? 'bg-card-border' : 'bg-card-border/60'
          }`}
        />
      )}
      <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
        <div
          className={`h-2.5 w-2.5 rotate-45 border bg-page ${
            enabled ? 'border-muted' : 'border-muted/50'
          }`}
        />
        <span
          className={`absolute text-[10px] font-medium ${enabled ? 'text-muted' : 'text-muted/50'}`}
        >
          {step}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h2 className={`mb-3 text-base font-semibold ${enabled ? 'text-text' : 'text-muted'}`}>
          {title}
        </h2>
        {enabled ? children : null}
      </div>
    </div>
  )
}
