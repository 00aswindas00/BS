import { useState } from 'react'
import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Settings,
  Search,
  ChevronUp,
} from 'lucide-react'
import { EmptyTableState } from '../shared/EmptyTableState'
import { formatCoinAmount, formatUsd, usePortfolioMarketData } from '../../hooks/usePortfolioMarketData'
import { CoinLogo } from '../shared/CoinLogo'

const MARGIN_TABS = ['Cross Margin', 'Isolated Margin'] as const
const FUNDS_TABS = ['Funds', 'Positions'] as const

export function MarginContent() {
  const [marginTab, setMarginTab] = useState<string>('Cross Margin')
  const [fundsTab, setFundsTab] = useState<string>('Funds')
  const [hidden, setHidden] = useState(false)
  const [hideSmall, setHideSmall] = useState(true)
  const [onlyDebts, setOnlyDebts] = useState(false)
  const { assets, totalBtc, totalUsd } = usePortfolioMarketData()
  const visibleAssets = hideSmall ? assets.filter((item) => item.usdValue >= 1) : assets

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-6">
          {MARGIN_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setMarginTab(tab)}
              className={`border-b-2 pb-2 text-sm transition-colors ${
                marginTab === tab
                  ? 'border-accent font-medium text-text'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-9 rounded-md bg-accent px-5 text-sm font-semibold text-black transition-colors hover:bg-accent-hover"
          >
            Borrow
          </button>
          <button
            type="button"
            className="h-9 rounded-md border border-input-border bg-card px-5 text-sm font-medium text-text transition-colors hover:bg-sidebar-active"
          >
            Repay
          </button>
          <button
            type="button"
            className="h-9 rounded-md border border-input-border bg-card px-5 text-sm font-medium text-text transition-colors hover:bg-sidebar-active"
          >
            Transfer
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-input-border bg-card text-muted hover:text-text"
            aria-label="More"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <section className="mb-4 rounded-xl border border-card-border bg-card p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm text-muted">Total balance</span>
              <button
                type="button"
                onClick={() => setHidden((v) => !v)}
                className="text-muted hover:text-text"
              >
                {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-text sm:text-3xl">
                {hidden ? '********' : formatUsd(totalUsd)}
              </span>
              <button type="button" className="flex items-center gap-1 text-base text-text">
                USD <ChevronDown size={14} className="text-muted" />
              </button>
            </div>
            <p className="mb-3 text-sm text-muted">{hidden ? '****' : `${formatCoinAmount(totalBtc, 'BTC')} BTC`}</p>
            <p className="mb-4 flex items-center gap-1 text-sm text-muted">
              Today&apos;s PNL {hidden ? '****' : '$0.00(0.00%)'}
              <ChevronRight size={14} />
            </p>
            <div className="text-sm">
              <span className="text-muted">Total Debt(BTC)</span>
              <p className="font-medium text-text">{hidden ? '****' : '0.00000000'}</p>
              <p className="text-xs text-muted">{hidden ? '****' : '≈ $0.00'}</p>
            </div>
          </div>

          <div className="relative">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted">Margin Level</span>
              <span className="flex items-center gap-1 text-sm text-accent">
                Cross 5x
                <Settings size={14} className="text-muted" />
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-semibold text-success">999.00</span>
              <MarginGauge />
            </div>
            <div className="mt-4 text-sm">
              <span className="text-muted">Account Equity(USD)</span>
              <p className="font-medium text-text">{hidden ? '****' : formatUsd(totalUsd)}</p>
              <p className="text-xs text-muted">{hidden ? '****' : `${formatCoinAmount(totalBtc, 'BTC')} BTC`}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-card-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border px-4 py-3 sm:px-5">
          <div className="flex gap-6">
            {FUNDS_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFundsTab(tab)}
                className={`border-b-2 py-2 text-sm transition-colors ${
                  fundsTab === tab
                    ? 'border-accent font-medium text-text'
                    : 'border-transparent text-muted hover:text-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 pb-2">
            <button type="button" className="text-muted hover:text-text" aria-label="Search">
              <Search size={18} />
            </button>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={hideSmall}
                onChange={(e) => setHideSmall(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Hide small accounts
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={onlyDebts}
                onChange={(e) => setOnlyDebts(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Only show debts
            </label>
          </div>
        </div>

        <div className="overflow-x-auto px-4 sm:px-5">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-card-border text-xs text-muted">
                {['Coin', 'Total balance', 'Available Balance', 'Borrowed', 'Interest', 'Equity'].map(
                  (h) => (
                    <th key={h} className="pb-3 font-normal">
                      <span className="inline-flex items-center gap-1">
                        {h}
                        <span className="flex flex-col">
                          <ChevronUp size={10} className="text-muted/40" />
                          <ChevronDown size={10} className="-mt-1 text-muted/40" />
                        </span>
                      </span>
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {visibleAssets.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyTableState />
                  </td>
                </tr>
              ) : (
                visibleAssets.map((asset) => (
                  <tr key={asset.symbol} className="border-b border-card-border last:border-b-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <CoinLogo symbol={asset.symbol} size={24} iconBg={asset.iconBg} />
                        <span className="text-text">{asset.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3 text-text">{formatCoinAmount(asset.amount, asset.symbol)}</td>
                    <td className="py-3 text-text">{formatCoinAmount(asset.amount, asset.symbol)}</td>
                    <td className="py-3 text-text">{onlyDebts ? formatCoinAmount(asset.amount * 0.02, asset.symbol) : '0.000000'}</td>
                    <td className="py-3 text-text">{onlyDebts ? formatCoinAmount(asset.amount * 0.0002, asset.symbol) : '0.000000'}</td>
                    <td className="py-3 text-text">{formatUsd(asset.usdValue)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function MarginGauge() {
  return (
    <div className="relative h-16 w-16">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#2b3139" strokeWidth="6" />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#0ecb81"
          strokeWidth="6"
          strokeDasharray="120 176"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1 w-6 origin-left rotate-[45deg] rounded bg-success" />
      </div>
    </div>
  )
}
