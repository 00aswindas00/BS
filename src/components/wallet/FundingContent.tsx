import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  ChevronDown,
  MoreVertical,
  Search,
  RefreshCw,
  MoreHorizontal,
  ChevronUp,
} from 'lucide-react'
import { formatCoinAmount, formatUsd, usePortfolioMarketData } from '../../hooks/usePortfolioMarketData'
import { CoinLogo } from '../shared/CoinLogo'

export function FundingContent() {
  const [hidden, setHidden] = useState(false)
  const [hideSmall, setHideSmall] = useState(false)
  const { assets, totalBtc, totalUsd } = usePortfolioMarketData()
  const visibleAssets = hideSmall ? assets.filter((item) => item.usdValue >= 1) : assets

  return (
    <div>
      <section className="mb-4 rounded-xl border border-card-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm text-muted">Est. Total Value</span>
              <button
                type="button"
                onClick={() => setHidden((v) => !v)}
                className="text-muted hover:text-text"
              >
                {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="mb-1 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-text sm:text-4xl">
                {hidden ? '********' : formatUsd(totalUsd)}
              </span>
              <button type="button" className="flex items-center gap-1 text-lg font-medium text-text">
                USD <ChevronDown size={16} className="text-muted" />
              </button>
            </div>
            <p className="text-sm text-muted">{hidden ? '********' : `${formatCoinAmount(totalBtc, 'BTC')} BTC`}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/deposit/crypto"
              className="flex h-9 min-w-[88px] items-center justify-center rounded-md border border-input-border bg-page px-4 text-sm font-medium text-text transition-colors hover:bg-sidebar-active"
            >
              Deposit
            </Link>
            <Link
              to="/withdraw/crypto"
              className="flex h-9 min-w-[88px] items-center justify-center rounded-md border border-input-border bg-page px-4 text-sm font-medium text-text transition-colors hover:bg-sidebar-active"
            >
              Withdraw
            </Link>
            <button
              type="button"
              className="h-9 min-w-[88px] rounded-md border border-input-border bg-page px-4 text-sm font-medium text-text transition-colors hover:bg-sidebar-active"
            >
              Transfer
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-input-border bg-page text-muted hover:text-text"
              aria-label="More"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-card-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border px-4 py-4 sm:px-5">
          <h2 className="text-lg font-semibold text-text">Funding</h2>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" className="text-muted hover:text-text" aria-label="Search">
              <Search size={18} />
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-muted hover:text-text"
            >
              <RefreshCw size={16} />
              Small Amount Exchange
            </button>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={hideSmall}
                onChange={(e) => setHideSmall(e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Hide assets &lt;1 USD
            </label>
          </div>
        </div>

        <div className="overflow-x-auto px-4 sm:px-5">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-card-border text-xs text-muted">
                {['Asset', 'Amount', 'Available', 'Frozen', 'Action'].map((h) => (
                  <th key={h} className={`pb-3 font-normal ${h === 'Action' ? 'text-right' : ''}`}>
                    <span className="inline-flex items-center gap-1">
                      {h}
                      {h !== 'Action' && (
                        <span className="flex flex-col">
                          <ChevronUp size={10} className="text-muted/40" />
                          <ChevronDown size={10} className="-mt-1 text-muted/40" />
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleAssets.map((asset) => (
                <tr
                  key={asset.symbol}
                  className="border-b border-card-border transition-colors hover:bg-sidebar-active/30 last:border-b-0"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <CoinLogo symbol={asset.symbol} size={32} iconBg={asset.iconBg} />
                      <div>
                        <div className="font-medium text-text">{asset.symbol}</div>
                        <div className="text-xs text-muted">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-text">{formatCoinAmount(asset.amount, asset.symbol)}</div>
                    <div className="text-xs text-muted">{formatUsd(asset.usdValue)}</div>
                  </td>
                  <td className="py-4 text-text">{formatCoinAmount(asset.amount, asset.symbol)}</td>
                  <td className="py-4 text-text">0.00</td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button type="button" className="text-sm font-medium text-accent hover:underline">
                        Convert
                      </button>
                      <button type="button" className="text-sm font-medium text-accent hover:underline">
                        Receive
                      </button>
                      <button type="button" className="text-muted hover:text-text">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
