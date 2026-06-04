import { useState } from 'react'
import { MARKET_TABS } from '../../lib/dashboardData'
import {
  formatCoinAmount,
  formatPercent,
  formatPrice,
  formatUsd,
  usePortfolioMarketData,
} from '../../hooks/usePortfolioMarketData'
import { CoinLogo } from '../shared/CoinLogo'

export function MarketsCard() {
  const [activeTab, setActiveTab] = useState<string>('Holding')
  const { assets } = usePortfolioMarketData()

  return (
    <section className="rounded-xl border border-card-border bg-card">
      <div className="border-b border-card-border px-4 pt-4">
        <h2 className="mb-3 text-base font-semibold text-text">Markets</h2>
        <div className="flex gap-4 overflow-x-auto pb-0 scrollbar-none">
          {MARKET_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 border-b-2 pb-3 text-sm transition-colors ${
                activeTab === tab
                  ? 'border-accent font-medium text-text'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="pb-3 font-normal">Coin</th>
              <th className="pb-3 font-normal">Amount</th>
              <th className="pb-3 font-normal">
                Last Price
                <span className="text-muted/70"> / </span>
                Cost Price
              </th>
              <th className="pb-3 font-normal">Change</th>
              <th className="pb-3 text-right font-normal">Trade</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((row) => (
              <tr
                key={row.symbol}
                className="border-t border-card-border transition-colors hover:bg-sidebar-active/50"
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <CoinLogo symbol={row.symbol} size={24} iconBg={row.iconBg} />
                    <span className="font-medium text-text">{row.symbol}</span>
                  </div>
                </td>
                <td className="py-3 text-text">{formatCoinAmount(row.amount, row.symbol)}</td>
                <td className="py-3 text-text">
                  {row.symbol === 'USDT' ? formatPrice(row.usdPrice) : formatUsd(row.usdPrice)}
                  <span className="text-muted"> / </span>
                  <span className="text-muted">--</span>
                </td>
                <td
                  className={`py-3 ${row.change24hPercent >= 0 ? 'text-success' : 'text-error'}`}
                >
                  {formatPercent(row.change24hPercent)}
                </td>
                <td className="py-3 text-right">
                  <button
                    type="button"
                    className="text-sm font-medium text-accent transition-colors hover:underline"
                  >
                    Trade
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
