import { useEffect, useRef, type ReactNode } from 'react'

type HeaderDropdownPanelProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  widthClass?: string
}

export function HeaderDropdownPanel({
  open,
  onClose,
  children,
  className = '',
  widthClass = 'w-[280px]',
}: HeaderDropdownPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      const trigger = (target as Element).closest?.('[data-header-dropdown-trigger]')
      if (trigger) return
      onClose()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      className={`absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-card-border bg-card shadow-xl ${widthClass} ${className}`}
      role="menu"
    >
      {children}
    </div>
  )
}
