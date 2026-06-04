import { Link, useLocation } from 'react-router-dom'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
} from 'lucide-react'

const ITEMS = [
  {
    label: 'Deposit Crypto',
    path: '/deposit/crypto',
    icon: ArrowDownToLine,
    unavailable: false,
  },
  {
    label: 'Withdraw Crypto',
    path: '/withdraw/crypto',
    icon: ArrowUpFromLine,
    unavailable: false,
  },
  {
    label: 'Deposit Fiat',
    path: '/deposit/fiat',
    icon: Wallet,
    unavailable: true,
  },
  {
    label: 'Withdraw Fiat',
    path: '/withdraw/fiat',
    icon: Wallet,
    unavailable: true,
  },
] as const

export function TransferSidebar() {
  const { pathname } = useLocation()

  return (
    <>
      {/* Mobile: horizontal tabs */}
      <nav className="flex gap-1 overflow-x-auto border-b border-card-border bg-page px-3 py-2 md:hidden">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.path
          if (item.unavailable) {
            return (
              <span
                key={item.path}
                className="flex shrink-0 cursor-not-allowed items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-muted/50"
              >
                <Icon size={14} />
                {item.label}
              </span>
            )
          }
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                active
                  ? 'bg-sidebar-active text-text'
                  : 'text-muted hover:bg-sidebar-active hover:text-text'
              }`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      {/* Desktop: vertical sidebar */}
      <aside className="hidden w-[220px] shrink-0 border-r border-card-border bg-page py-6 pl-4 pr-2 md:block">
        <nav className="flex flex-col gap-0.5">
        {ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname === item.path
          if (item.unavailable) {
            return (
              <span
                key={item.path}
                className="relative flex cursor-not-allowed items-center justify-between rounded-md py-3 pl-4 pr-3 text-sm text-muted/50"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                <span className="text-[10px] text-muted/40">Unavailable</span>
              </span>
            )
          }
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center justify-between rounded-md py-3 pl-4 pr-3 text-sm transition-colors ${
                active
                  ? 'bg-sidebar-active font-medium text-text before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-accent'
                  : 'text-muted hover:bg-sidebar-active hover:text-text'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} />
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  </>
  )
}
