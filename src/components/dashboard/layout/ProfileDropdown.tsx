import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { HeaderDropdownPanel } from './HeaderDropdownPanel'
import { PROFILE_MENU, DEFAULT_USER } from '../../../lib/headerNavData'
import { clearAuthSession } from '../../../lib/authMock'

export function ProfileDropdown({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()

  function handleLogout() {
    clearAuthSession()
    onClose()
    navigate('/', { replace: true })
  }

  return (
    <HeaderDropdownPanel open={open} onClose={onClose} widthClass="w-[300px]">
      <div className="border-b border-card-border p-4">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent">
            <User size={24} className="text-black" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text">{DEFAULT_USER.displayName}</p>
            <p className="mt-0.5 text-xs text-muted">{DEFAULT_USER.emailMasked}</p>
            <p className="mt-0.5 text-xs text-muted">ID:{DEFAULT_USER.uid}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded bg-sidebar-active px-2 py-0.5 text-[10px] text-text">
                Regular User
              </span>
              <span className="rounded bg-success/15 px-2 py-0.5 text-[10px] text-success">
                Verified
              </span>
              <span className="rounded bg-sidebar-active px-2 py-0.5 text-[10px] text-text">
                Link X
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="py-1">
        {PROFILE_MENU.map((item) => {
          const Icon = item.icon
          if (item.external) {
            return (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-text transition-colors hover:bg-sidebar-active"
              >
                <Icon size={18} className="text-muted" />
                {item.label}
              </a>
            )
          }
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text transition-colors hover:bg-sidebar-active"
            >
              <Icon size={18} className="text-muted" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-card-border py-1">
        <button
          type="button"
          onClick={handleLogout}
          role="menuitem"
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text transition-colors hover:bg-sidebar-active"
        >
          <LogOut size={18} className="text-muted" />
          Log Out
        </button>
      </div>
    </HeaderDropdownPanel>
  )
}
