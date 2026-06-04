import { Link } from 'react-router-dom'
import { HeaderDropdownPanel } from './HeaderDropdownPanel'
import { WALLET_MENU } from '../../../lib/headerNavData'

type WalletDropdownProps = {
  open: boolean
  onClose: () => void
}

export function WalletDropdown({ open, onClose }: WalletDropdownProps) {
  return (
    <HeaderDropdownPanel open={open} onClose={onClose} widthClass="w-[240px]">
      <nav className="py-2">
        {WALLET_MENU.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              onClick={onClose}
              role="menuitem"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-text transition-colors hover:bg-sidebar-active"
            >
              <Icon size={18} className="shrink-0 text-muted" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </HeaderDropdownPanel>
  )
}
