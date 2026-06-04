import type { ReactNode } from 'react'

type SocialAuthButtonProps = {
  icon: ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}

export function SocialAuthButton({
  icon,
  label,
  onClick,
  disabled = false,
}: SocialAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative flex h-11 w-full items-center justify-center rounded-lg border border-input-border bg-transparent px-4 text-sm font-medium text-text transition-colors hover:bg-card-border active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="absolute left-4 flex items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
