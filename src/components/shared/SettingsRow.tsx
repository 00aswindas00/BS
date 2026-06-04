import type { ReactNode } from 'react'

type SettingsRowProps = {
  icon?: ReactNode
  title: string
  description?: string
  trailing?: ReactNode
  action?: ReactNode
  border?: boolean
}

export function SettingsRow({
  icon,
  title,
  description,
  trailing,
  action,
  border = true,
}: SettingsRowProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 py-4 ${
        border ? 'border-b border-card-border last:border-0' : ''
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {icon && <div className="mt-0.5 shrink-0 text-muted">{icon}</div>}
        <div className="min-w-0">
          <p className="text-sm font-medium text-text">{title}</p>
          {description && (
            <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
          )}
          {trailing}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function ManageButton({ label = 'Manage' }: { label?: string }) {
  return (
    <button
      type="button"
      className="h-8 min-w-[72px] rounded-md border border-input-border bg-sidebar-active px-4 text-xs font-medium text-text transition-colors hover:border-input-hover"
    >
      {label}
    </button>
  )
}

export function StatusOn() {
  return (
    <span className="flex items-center gap-1.5 text-xs text-success">
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      On
    </span>
  )
}

export function StatusOff() {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-muted" />
      Off
    </span>
  )
}
