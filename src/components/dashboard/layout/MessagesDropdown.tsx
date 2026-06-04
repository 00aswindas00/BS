import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HeaderDropdownPanel } from './HeaderDropdownPanel'
import { MESSAGES_MENU } from '../../../lib/headerNavData'

type MessagesDropdownProps = {
  open: boolean
  onClose: () => void
}

export function MessagesDropdown({ open, onClose }: MessagesDropdownProps) {
  return (
    <HeaderDropdownPanel open={open} onClose={onClose} widthClass="w-[320px]">
      <div className="flex items-center justify-end border-b border-card-border px-4 py-2">
        <button
          type="button"
          className="flex items-center gap-0.5 text-xs text-muted transition-colors hover:text-text"
        >
          View All
          <ChevronRight size={14} />
        </button>
      </div>
      <nav className="max-h-[360px] overflow-y-auto py-1">
        {MESSAGES_MENU.map((item) => {
          const Icon = item.icon
          const content = (
            <>
              <Icon size={20} className="mt-0.5 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text">{item.label}</p>
                {item.subtitle && (
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted">{item.subtitle}</p>
                    {item.time && (
                      <span className="shrink-0 text-xs text-muted">{item.time}</span>
                    )}
                  </div>
                )}
              </div>
            </>
          )

          if (item.path && item.path !== '#') {
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className="flex gap-3 px-4 py-3 transition-colors hover:bg-sidebar-active"
              >
                {content}
              </Link>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={onClose}
              className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-sidebar-active"
            >
              {content}
            </button>
          )
        })}
      </nav>
    </HeaderDropdownPanel>
  )
}
