import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  MessageSquare,
  Wallet,
  Download,
  Globe,
  Moon,
  ChevronDown,
  User,
  Menu,
} from 'lucide-react'
import { BinanceLogo } from '../../../icons/BinanceLogo'
import { ProfileDropdown } from './ProfileDropdown'
import { WalletDropdown } from './WalletDropdown'
import { MessagesDropdown } from './MessagesDropdown'
import { DashboardSidebar } from './DashboardSidebar'

const NAV_WITH_DROPDOWN = ['Trade', 'Futures', 'Earn', 'Square', 'More']
const NAV_PLAIN = ['Buy Crypto', 'Markets']

type OpenPanel = 'profile' | 'wallet' | 'messages' | null

export function DashboardHeader() {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)
  const [mobileSidebar, setMobileSidebar] = useState(false)

  function toggle(panel: OpenPanel) {
    setOpenPanel((current) => (current === panel ? null : panel))
  }

  function close() {
    setOpenPanel(null)
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b border-card-border bg-page px-2 sm:px-4 lg:px-6">
      {/* Mobile hamburger menu */}
      <button
        type="button"
        onClick={() => setMobileSidebar((v) => !v)}
        className="mr-1 flex h-9 w-9 items-center justify-center rounded text-muted transition-colors hover:text-text md:hidden"
        aria-label="Menu"
      >
        <Menu size={22} />
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-8">
        <BinanceLogo size="header" />
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_PLAIN.map((item) => (
            <button
              key={item}
              type="button"
              className="text-sm font-medium text-text transition-colors hover:text-accent"
            >
              {item}
            </button>
          ))}
          {NAV_WITH_DROPDOWN.map((item) => (
            <button
              key={item}
              type="button"
              className="flex items-center gap-0.5 text-sm font-medium text-text transition-colors hover:text-accent"
            >
              {item}
              <ChevronDown size={14} className="text-muted" />
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-0.5 sm:gap-2">
        {/* Deposit – visible on mobile too */}
        <Link
          to="/deposit/crypto"
          onClick={close}
          className="flex h-8 items-center rounded-md bg-accent px-3 text-xs font-semibold text-black transition-colors hover:bg-accent-hover sm:px-4 sm:text-sm"
        >
          Deposit
        </Link>

        {/* Profile – always visible */}
        <div className="relative">
          <button
            type="button"
            data-header-dropdown-trigger
            onClick={() => toggle('profile')}
            aria-expanded={openPanel === 'profile'}
            aria-haspopup="menu"
            aria-label="Profile"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              openPanel === 'profile'
                ? 'bg-accent text-black'
                : 'text-muted hover:text-text'
            }`}
          >
            <User size={20} strokeWidth={openPanel === 'profile' ? 2 : 1.5} />
          </button>
          <ProfileDropdown
            open={openPanel === 'profile'}
            onClose={close}
          />
        </div>

        {/* Wallet – visible on mobile too */}
        <div className="relative">
          <button
            type="button"
            data-header-dropdown-trigger
            onClick={() => toggle('wallet')}
            aria-expanded={openPanel === 'wallet'}
            aria-haspopup="menu"
            aria-label="Wallet"
            className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${
              openPanel === 'wallet' ? 'text-accent' : 'text-muted hover:text-text'
            }`}
          >
            <Wallet size={20} />
          </button>
          <WalletDropdown open={openPanel === 'wallet'} onClose={close} />
        </div>

        {/* Search – hidden on mobile */}
        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center rounded text-muted transition-colors hover:text-text sm:flex"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        {/* Messages – hidden on mobile */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            data-header-dropdown-trigger
            onClick={() => toggle('messages')}
            aria-expanded={openPanel === 'messages'}
            aria-haspopup="menu"
            aria-label="Messages"
            className={`relative flex h-9 w-9 items-center justify-center rounded transition-colors ${
              openPanel === 'messages' ? 'text-accent' : 'text-muted hover:text-text'
            }`}
          >
            <MessageSquare size={20} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
          <MessagesDropdown open={openPanel === 'messages'} onClose={close} />
        </div>

        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center rounded text-muted transition-colors hover:text-text md:flex"
          aria-label="Download"
        >
          <Download size={20} />
        </button>
        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center rounded text-muted transition-colors hover:text-text lg:flex"
          aria-label="Language"
        >
          <Globe size={20} />
        </button>
        {/* Moon – hidden on mobile */}
        <button
          type="button"
          className="hidden h-9 w-9 items-center justify-center rounded text-muted transition-colors hover:text-text sm:flex"
          aria-label="Toggle theme"
        >
          <Moon size={20} />
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebar(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[280px] flex-col bg-page shadow-xl">
            <div className="flex h-14 items-center border-b border-card-border px-4">
              <BinanceLogo size="header" />
              <button
                type="button"
                onClick={() => setMobileSidebar(false)}
                className="ml-auto text-muted hover:text-text"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <DashboardSidebar mobile />
          </aside>
        </div>
      )}
    </header>
  )
}
