import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ChevronDown, Info } from 'lucide-react'
import {
  formatCoinAmount,
  formatPercent,
  formatUsd,
  usePortfolioMarketData,
} from '../../hooks/usePortfolioMarketData'

export function BalanceOverview() {
  const [hidden, setHidden] = useState(false)
  const { totalBtc, totalUsd, totalPnl24hUsd, totalPnl24hPercent } = usePortfolioMarketData()
  const pnlPositive = totalPnl24hUsd >= 0

  return (
    <section className="mb-6 border-b border-card-border pb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-muted">Est. Total Value</span>
            <button
              type="button"
              onClick={() => setHidden((v) => !v)}
              className="text-muted transition-colors hover:text-text"
              aria-label={hidden ? 'Show balance' : 'Hide balance'}
            >
              {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mb-1 flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              {hidden ? '********' : formatUsd(totalUsd)}
            </h1>
            <ChevronDown size={18} className="text-muted" />
          </div>
          <p className="mb-3 text-sm text-muted">{hidden ? '********' : `${formatCoinAmount(totalBtc, 'BTC')} BTC`}</p>
          <p className="flex items-center gap-1.5 text-sm">
            <span className="text-muted">Today&apos;s PnL</span>
            <Info size={14} className="text-muted" />
            <span className={pnlPositive ? 'text-success' : 'text-error'}>
              {hidden
                ? '********'
                : `${pnlPositive ? '+' : ''}${formatUsd(totalPnl24hUsd)} (${formatPercent(totalPnl24hPercent)})`}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/deposit/crypto"
            className="flex h-9 min-w-[88px] items-center justify-center rounded-md border border-input-border bg-card px-4 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
          >
            Deposit
          </Link>
          <Link
            to="/withdraw/crypto"
            className="flex h-9 min-w-[88px] items-center justify-center rounded-md border border-input-border bg-card px-4 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
          >
            Withdraw
          </Link>
          {['Transfer', 'History'].map((label) => (
            <button
              key={label}
              type="button"
              className="h-9 min-w-[88px] rounded-md border border-input-border bg-card px-4 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="text-muted transition-colors hover:text-text"
          aria-label="Expand section"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </section>
  )
}
