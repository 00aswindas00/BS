import { useState } from 'react'
import {
  Search,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-react'
import {
  formatCoinAmount,
  formatPercent,
  formatUsd,
  usePortfolioMarketData,
} from '../../hooks/usePortfolioMarketData'
import { CoinLogo } from '../shared/CoinLogo'

type SortKey = 'asset' | 'amount' | 'available'

export function SpotAssetsTable() {
  const [hideSmall, setHideSmall] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const { assets } = usePortfolioMarketData()
  const visibleAssets = hideSmall ? assets.filter((item) => item.usdValue >= 1) : assets

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  return (
    <section className="rounded-xl border border-card-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border px-4 py-4 sm:px-5">
        <h2 className="text-lg font-semibold text-text">Spot</h2>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="text-muted transition-colors hover:text-text"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
          >
            <RefreshCw size={16} />
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

      <div className="overflow-x-auto px-4 sm:px-5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-card-border text-xs text-muted">
              <th className="pb-3 font-normal">
                <SortHeader
                  label="Asset"
                  active={sortKey === 'asset'}
                  asc={sortAsc}
                  onClick={() => toggleSort('asset')}
                />
              </th>
              <th className="pb-3 font-normal">
                <SortHeader
                  label="Amount"
                  active={sortKey === 'amount'}
                  asc={sortAsc}
                  onClick={() => toggleSort('amount')}
                />
              </th>
              <th className="pb-3 font-normal">
                <SortHeader
                  label="Available"
                  active={sortKey === 'available'}
                  asc={sortAsc}
                  onClick={() => toggleSort('available')}
                />
              </th>
              <th className="pb-3 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleAssets.map((asset) => (
              <tr
                key={asset.symbol}
                className="border-b border-card-border last:border-0 transition-colors hover:bg-sidebar-active/30"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <CoinLogo symbol={asset.symbol} size={32} iconBg={asset.iconBg} />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-text">{asset.symbol}</span>
                        {asset.symbol === 'ETH' && (
                          <span className="flex items-center gap-0.5 rounded bg-[#1a2332] px-1.5 py-0.5 text-[10px] text-[#58a6ff]">
                            Soft Staking
                            <ChevronRight size={10} />
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted">{asset.name}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-text">{formatCoinAmount(asset.amount, asset.symbol)}</span>
                  <span className="text-muted"> / </span>
                  <span className="text-muted">{formatUsd(asset.usdValue)}</span>
                  <div
                    className={`text-xs ${
                      asset.change24hPercent >= 0 ? 'text-success' : 'text-error'
                    }`}
                  >
                    24h {formatPercent(asset.change24hPercent)}
                  </div>
                </td>
                <td className="py-4 text-text">{formatCoinAmount(asset.amount, asset.symbol)}</td>
                <td className="py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="text-sm font-medium text-accent transition-colors hover:underline"
                    >
                      Convert
                    </button>
                    <button
                      type="button"
                      className="text-sm font-medium text-accent transition-colors hover:underline"
                    >
                      Earn
                    </button>
                    <button
                      type="button"
                      className="text-muted transition-colors hover:text-text"
                      aria-label={`More actions for ${asset.symbol}`}
                    >
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
  )
}

function SortHeader({
  label,
  active,
  asc,
  onClick,
}: {
  label: string
  active: boolean
  asc: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 transition-colors hover:text-text"
    >
      {label}
      <span className="flex flex-col">
        <ChevronUp
          size={10}
          className={active && asc ? 'text-text' : 'text-muted/40'}
        />
        <ChevronDown
          size={10}
          className={`-mt-1 ${active && !asc ? 'text-text' : 'text-muted/40'}`}
        />
      </span>
    </button>
  )
}
