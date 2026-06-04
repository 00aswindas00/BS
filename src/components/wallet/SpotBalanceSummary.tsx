import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, ChevronDown, ChevronRight, Info, MoreVertical } from 'lucide-react'
import {
  formatCoinAmount,
  formatPercent,
  formatUsd,
  usePortfolioMarketData,
} from '../../hooks/usePortfolioMarketData'

export function SpotBalanceSummary() {
  const [hidden, setHidden] = useState(false)
  const { totalBtc, totalUsd, totalPnl24hUsd, totalPnl24hPercent } = usePortfolioMarketData()
  const pnlPositive = totalPnl24hUsd >= 0

  return (
    <section className="mb-4 rounded-xl border border-card-border bg-card p-5 sm:p-6">
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
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              {hidden ? '****' : formatUsd(totalUsd)}
            </span>
            <button
              type="button"
              className="flex items-center gap-1 text-lg font-medium text-text"
            >
              {hidden ? '***' : 'USD'}
              <ChevronDown size={16} className="text-muted" />
            </button>
          </div>
          <p className="mb-3 text-sm text-muted">{hidden ? '********' : `${formatCoinAmount(totalBtc, 'BTC')} BTC`}</p>
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <span>Today&apos;s PnL</span>
            <Info size={14} />
            <span className={pnlPositive ? 'text-success' : 'text-error'}>
              {hidden
                ? '********'
                : `${pnlPositive ? '+' : ''}${formatUsd(totalPnl24hUsd)} (${formatPercent(totalPnl24hPercent)})`}
            </span>
            <ChevronRight size={14} />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/deposit/crypto"
            className="flex h-9 min-w-[88px] items-center justify-center rounded-md border border-input-border bg-page px-4 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
          >
            Deposit
          </Link>
          <Link
            to="/withdraw/crypto"
            className="flex h-9 min-w-[88px] items-center justify-center rounded-md border border-input-border bg-page px-4 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
          >
            Withdraw
          </Link>
          <button
            type="button"
            className="h-9 min-w-[88px] rounded-md border border-input-border bg-page px-4 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
          >
            Transfer
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-input-border bg-page text-muted transition-colors hover:border-input-hover hover:text-text"
            aria-label="More options"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
