import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ClipboardList,
  Gift,
  UserPlus,
  UserCircle,
  GitBranch,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  ASSETS_NAV,
  ORDERS_NAV,
  ACCOUNT_NAV,
  getExpandedSection,
} from '../../../lib/navConfig'

type SubmenuKey = 'assets' | 'orders' | 'account'

type NavItem = {
  label: string
  icon: LucideIcon
  path?: string
  submenuKey?: SubmenuKey
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Assets', icon: Wallet, submenuKey: 'assets' },
  { label: 'Orders', icon: ClipboardList, submenuKey: 'orders' },
  { label: 'Rewards Hub', icon: Gift, path: '/rewards' },
  { label: 'Referral', icon: UserPlus, path: '/referral' },
  { label: 'Account', icon: UserCircle, submenuKey: 'account' },
  { label: 'Sub Accounts', icon: GitBranch, path: '/sub-accounts' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

const SUBMENUS: Record<SubmenuKey, typeof ASSETS_NAV> = {
  assets: ASSETS_NAV,
  orders: ORDERS_NAV,
  account: ACCOUNT_NAV,
}

export function DashboardSidebar({ mobile = false }: { mobile?: boolean } = {}) {
  const { pathname } = useLocation()
  const routeSection = getExpandedSection(pathname)

  const [expanded, setExpanded] = useState<Set<SubmenuKey>>(() => {
    const initial = new Set<SubmenuKey>()
    if (routeSection) initial.add(routeSection)
    return initial
  })

  useEffect(() => {
    if (routeSection) {
      setExpanded((prev) => new Set(prev).add(routeSection))
    }
  }, [routeSection])

  function toggleSection(key: SubmenuKey) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <aside className={`${mobile ? 'flex' : 'hidden md:flex'} ${mobile ? 'h-full' : 'sticky top-14 h-[calc(100vh-3.5rem)]'} w-[232px] shrink-0 flex-col border-r border-card-border bg-page py-4`}>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const submenuKey = item.submenuKey
          const isExpanded = submenuKey != null && expanded.has(submenuKey)
          const isParentActive =
            submenuKey != null && routeSection === submenuKey
          const submenu = submenuKey ? SUBMENUS[submenuKey] : null

          return (
            <div key={item.label}>
              {item.path ? (
                <Link
                  to={item.path}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                    pathname === item.path
                      ? 'bg-sidebar-active font-medium text-text'
                      : 'text-muted hover:bg-sidebar-active hover:text-text'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => submenuKey && toggleSection(submenuKey)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isParentActive
                      ? 'font-medium text-text'
                      : 'text-muted hover:bg-sidebar-active hover:text-text'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={14} className="text-muted" />
                  ) : (
                    <ChevronDown size={14} className="text-muted" />
                  )}
                </button>
              )}

              {submenu && isExpanded && (
                <div className="mt-0.5 flex flex-col gap-0.5">
                  {submenu.map((sub) => {
                    const subActive = pathname === sub.path
                    return (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className={`block rounded-md py-2 pr-3 text-sm transition-colors ${
                          subActive
                            ? 'border-l-2 border-[#3c6af0] bg-sidebar-active pl-[34px] font-medium text-text'
                            : 'pl-9 text-muted hover:bg-sidebar-active hover:text-text'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <button
        type="button"
        className="mx-3 mt-2 flex h-8 w-8 items-center justify-center rounded border border-card-border text-muted transition-colors hover:text-text"
        aria-label="Collapse sidebar"
      >
        <ChevronLeft size={16} />
      </button>
    </aside>
  )
}
