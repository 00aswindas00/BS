import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import {
  formatCoinAmount,
  formatPercent,
  formatUsd,
  usePortfolioMarketData,
} from '../../hooks/usePortfolioMarketData'

export function EstimatedValueCard() {
  const [hidden, setHidden] = useState(false)
  const { totalBtc, totalUsd, totalPnl24hUsd, totalPnl24hPercent } = usePortfolioMarketData()
  const pnlPositive = totalPnl24hUsd >= 0

  return (
    <section className="mb-6 rounded-xl border border-card-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted">Est. Total Value</h2>
            <button
              type="button"
              onClick={() => setHidden((v) => !v)}
              className="text-muted transition-colors hover:text-text"
              aria-label={hidden ? 'Show balance' : 'Hide balance'}
            >
              {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="mb-2">
            <p className="text-2xl font-semibold text-text sm:text-3xl">
              {hidden ? '******' : formatUsd(totalUsd)}
            </p>
            <p className="mt-1 text-sm text-muted">{hidden ? '******' : `${formatCoinAmount(totalBtc, 'BTC')} BTC`}</p>
          </div>
          <p className="text-sm">
            <span className="text-muted">Today&apos;s PNL </span>
            <span className={pnlPositive ? 'text-success' : 'text-error'}>
              {hidden ? '******' : `${pnlPositive ? '+' : ''}${formatUsd(totalPnl24hUsd)}`}
            </span>
            {!hidden && (
              <span className={pnlPositive ? 'text-success' : 'text-error'}>
                {' '}
                ({formatPercent(totalPnl24hPercent)})
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/deposit/crypto"
            className="flex h-9 items-center rounded-md border border-accent px-4 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            Deposit
          </Link>
          <Link
            to="/withdraw/crypto"
            className="flex h-9 items-center rounded-md border border-input-border px-4 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
          >
            Withdraw
          </Link>
          <button
            type="button"
            className="h-9 rounded-md border border-input-border px-4 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
          >
            Cash In
          </button>
        </div>
      </div>
    </section>
  )
}
