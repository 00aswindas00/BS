import { useState } from 'react'
import { Search, Crosshair, ChevronDown } from 'lucide-react'
import {
  formatCoinAmount,
  formatPercent,
  formatPrice,
  formatUsd,
  usePortfolioMarketData,
} from '../../hooks/usePortfolioMarketData'
import { CoinLogo } from '../shared/CoinLogo'

export function MyAssetsSection() {
  const [activeTab, setActiveTab] = useState<'asset' | 'account'>('asset')
  const [hideSmall, setHideSmall] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const { assets } = usePortfolioMarketData()
  const visibleAssets = hideSmall ? assets.filter((item) => item.usdValue >= 1) : assets

  return (
    <section className="mb-6 rounded-xl border border-card-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border px-4 pt-4">
        <h2 className="text-lg font-semibold text-text">My Assets</h2>
        <div className="flex flex-wrap items-center gap-4 pb-3">
          <button
            type="button"
            className="text-muted transition-colors hover:text-text"
            aria-label="Search assets"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
          >
            <Crosshair size={16} />
            Small Amount Exchange
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={hideSmall}
              onChange={(e) => setHideSmall(e.target.checked)}
              className="h-4 w-4 rounded border-input-border bg-page accent-accent"
            />
            Hide assets &lt;1 USD
          </label>
        </div>
      </div>

      <div className="flex gap-6 border-b border-card-border px-4">
        {(['asset', 'account'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 pb-3 pt-3 text-sm transition-colors ${
              activeTab === tab
                ? 'border-accent font-medium text-text'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {tab === 'asset' ? 'Asset View' : 'Account View'}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="pb-3 font-normal">Asset</th>
              <th className="pb-3 font-normal">Amount</th>
              <th className="pb-3 font-normal">
                Asset Price <span className="text-muted/60">/</span> Cost Price
              </th>
              <th className="pb-3 font-normal">Today&apos;s PnL</th>
              <th className="w-8 pb-3" />
            </tr>
          </thead>
          <tbody>
            {visibleAssets.map((asset) => (
              <tr key={asset.symbol} className="border-t border-card-border">
                <td className="py-4">
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="flex items-center gap-3 text-left"
                  >
                    <CoinLogo symbol={asset.symbol} size={32} iconBg={asset.iconBg} />
                    <span>
                      <span className="font-medium text-text">{asset.symbol}</span>
                      <span className="mx-1.5 text-muted">|</span>
                      <span className="text-muted">{asset.name}</span>
                    </span>
                  </button>
                </td>
                <td className="py-4">
                  <div className="text-text">{formatCoinAmount(asset.amount, asset.symbol)}</div>
                  <div className="text-xs text-muted">{formatUsd(asset.usdValue)}</div>
                </td>
                <td className="py-4">
                  <div className="text-text">{asset.symbol === 'USDT' ? formatPrice(asset.usdPrice) : formatUsd(asset.usdPrice)}</div>
                  <div className="text-xs text-muted">--</div>
                </td>
                <td
                  className={`py-4 ${
                    asset.change24hPercent >= 0 ? 'text-success' : 'text-error'
                  }`}
                >
                  {asset.pnl24hUsd >= 0 ? '+' : ''}
                  {formatUsd(asset.pnl24hUsd)} ({formatPercent(asset.change24hPercent)})
                </td>
                <td className="py-4">
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="text-muted"
                    aria-label={expanded ? 'Collapse' : 'Expand'}
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
