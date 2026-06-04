import { useState } from 'react'
import { DISCOVER_TABS, EARN_PRODUCTS } from '../../lib/dashboardData'
import { CoinLogo } from '../shared/CoinLogo'

export function DiscoverCard() {
  const [activeTab, setActiveTab] = useState<string>('Earn')

  return (
    <section className="rounded-xl border border-card-border bg-card">
      <div className="border-b border-card-border px-4 pt-4">
        <h2 className="mb-3 text-base font-semibold text-text">Discover</h2>
        <div className="flex gap-6">
          {DISCOVER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 text-sm transition-colors ${
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
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="pb-3 font-normal">Coin</th>
              <th className="pb-3 font-normal">Est. APR</th>
              <th className="pb-3 font-normal">Duration</th>
              <th className="pb-3 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {EARN_PRODUCTS.map((row) => (
              <tr
                key={row.coin}
                className="border-t border-card-border transition-colors hover:bg-sidebar-active/50"
              >
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <CoinLogo symbol={row.coin} size={24} iconBg={row.iconBg} />
                    <span className="font-medium text-text">{row.coin}</span>
                  </div>
                </td>
                <td className="py-3 font-medium text-success">{row.apr}</td>
                <td className="py-3 text-text">{row.duration}</td>
                <td className="py-3 text-right">
                  <button
                    type="button"
                    className="text-sm font-medium text-accent transition-colors hover:underline"
                  >
                    Subscribe
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
