import { Download } from 'lucide-react'
import { EmptyTableState } from '../shared/EmptyTableState'
import { formatCoinAmount, formatUsd, usePortfolioMarketData } from '../../hooks/usePortfolioMarketData'
import { usePortfolioStore } from '../../hooks/usePortfolioStore'
import { CoinLogo } from '../shared/CoinLogo'

/** Format transaction qty: max 6 integer digits + 4 decimal places */
function fmtTxQty(value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return value
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
}

export function AccountStatementContent() {
  const { assets, totalBtc, totalUsd, btcUsdPrice } = usePortfolioMarketData()
  const { transactions } = usePortfolioStore()
  const recent = transactions.slice(0, 8)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text">Account Statement</h1>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-md border border-input-border bg-card px-4 text-sm text-text hover:bg-sidebar-active"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <input
          type="text"
          readOnly
          value="2024/05/30"
          className="h-10 w-[140px] rounded-md border border-input-border bg-card px-3 text-sm text-text"
        />
        <select className="h-10 min-w-[220px] rounded-md border border-input-border bg-card px-3 text-sm text-text">
          <option>Account: sunilkryptousdt@gmail.com</option>
        </select>
        <select className="h-10 min-w-[120px] rounded-md border border-input-border bg-card px-3 text-sm text-text">
          <option>Wallet: All</option>
        </select>
        <select className="h-10 min-w-[160px] rounded-md border border-input-border bg-card px-3 text-sm text-text">
          <option>Estimated Value: USDT</option>
        </select>
        <button
          type="button"
          className="h-10 rounded-md bg-accent px-5 text-sm font-semibold text-black hover:bg-accent-hover"
        >
          Search
        </button>
        <button
          type="button"
          className="h-10 rounded-md border border-input-border bg-card px-5 text-sm text-text hover:bg-sidebar-active"
        >
          Reset
        </button>
      </div>

      <section className="mb-6 rounded-xl border border-card-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Overview</h2>
          <span className="text-xs text-muted">Data refreshes at UTC+0 daily.</span>
        </div>
        <div className="mb-4 overflow-x-auto text-sm">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="pb-2 font-normal">Date</th>
                <th className="pb-2 font-normal">User ID</th>
                <th className="pb-2 font-normal">Account Type</th>
                <th className="pb-2 font-normal">Wallet</th>
                <th className="pb-2 font-normal">Role</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-text">
                <td className="py-2">2024-05-30</td>
                <td>182758465</td>
                <td>Master Account</td>
                <td>All</td>
                <td>1 BTC ≈ {formatUsd(btcUsdPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Total Value" btc={formatCoinAmount(totalBtc, 'BTC')} usdt={formatUsd(totalUsd)} />
          <SummaryCard label="Spot" btc={formatCoinAmount(totalBtc, 'BTC')} usdt={formatUsd(totalUsd)} />
          <SummaryCard
            label="Funding"
            btc={formatCoinAmount(totalBtc * 0.35, 'BTC')}
            usdt={formatUsd(totalUsd * 0.35)}
          />
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-card-border bg-card p-5">
        <h2 className="mb-1 text-lg font-semibold text-text">Spot</h2>
        <p className="mb-4 text-sm text-muted">
          Total Balance: {formatUsd(totalUsd)} ({formatCoinAmount(totalBtc, 'BTC')} BTC)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-card-border text-left text-xs text-muted">
                <th className="py-2 font-normal">Coin</th>
                <th className="py-2 font-normal text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.symbol} className="border-b border-card-border last:border-b-0">
                  <td className="py-3 text-text">{asset.symbol}</td>
                  <td className="py-3 text-right">
                    <div className="text-text">{formatCoinAmount(asset.amount, asset.symbol)}</div>
                    <div className="text-xs text-muted">{formatUsd(asset.usdValue)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-card-border bg-card p-5">
        <h2 className="mb-1 text-lg font-semibold text-text">Funding</h2>
        <p className="mb-4 text-sm text-muted">
          Total Balance: {formatUsd(totalUsd)} ({formatCoinAmount(totalBtc, 'BTC')} BTC)
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_200px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-xs text-muted">
                <th className="pb-2 text-left font-normal">Coin</th>
                <th className="pb-2 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.symbol}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <CoinLogo symbol={asset.symbol} size={24} iconBg={asset.iconBg} />
                      <div>
                        <div className="font-medium text-text">{asset.symbol}</div>
                        <div className="text-xs text-muted">{asset.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="text-text">{formatCoinAmount(asset.amount, asset.symbol)}</div>
                    <div className="text-xs text-muted">{formatUsd(asset.usdValue)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col items-center justify-center">
            <DonutChart />
            <p className="mt-2 text-xs text-muted">{assets[0]?.symbol ?? 'BTC'} dominant holding</p>
          </div>
        </div>
        <div className="mt-5 border-t border-card-border pt-4">
          <h3 className="mb-3 text-sm font-medium text-text">Recent Completed Transactions</h3>
          {recent.length === 0 ? (
            <EmptyTableState message="No records found." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[840px] text-left text-sm">
                <thead>
                  <tr className="border-b border-card-border text-xs text-muted">
                    <th className="py-2 font-normal">Time</th>
                    <th className="py-2 font-normal">Coin</th>
                    <th className="py-2 font-normal">Qty</th>
                    <th className="py-2 font-normal">Fee</th>
                    <th className="py-2 font-normal">Address</th>
                    <th className="py-2 font-normal">TxID</th>
                    <th className="py-2 font-normal">Created</th>
                    <th className="py-2 font-normal">Completed</th>
                    <th className="py-2 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((record) => (
                    <tr key={record.id} className="border-b border-card-border last:border-b-0">
                    <td className="py-2 text-text">{record.time}</td>
                    <td className="py-2 text-text">{record.coin}</td>
                    <td className="py-2 text-text">{fmtTxQty(record.qty)}</td>
                    <td className="py-2 text-text">{fmtTxQty(record.fee)}</td>
                    <td className="py-2 text-muted max-w-[140px] truncate" title={record.address}>{record.address}</td>
                    <td className="py-2 text-muted max-w-[160px] truncate" title={record.txid}>{record.txid}</td>
                    <td className="py-2 text-muted">{record.createdAt.slice(0, 19).replace('T', ' ')}</td>
                    <td className="py-2 text-muted">{record.completedAt.slice(0, 19).replace('T', ' ')}</td>
                    <td className={`py-2 ${record.status === 'Pending Approval' ? 'text-accent' : 'text-success'}`}>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function SummaryCard({
  label,
  usdt,
  btc,
}: {
  label: string
  usdt: string
  btc: string
}) {
  return (
    <div className="rounded-lg border border-card-border bg-page/50 p-4">
      <p className="mb-2 text-sm text-muted">{label}</p>
      <p className="font-medium text-text">{usdt}</p>
      <p className="text-xs text-muted">{btc} BTC</p>
    </div>
  )
}

function DonutChart() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="48" fill="none" stroke="#2b3139" strokeWidth="16" />
      <circle
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke="#58a6ff"
        strokeWidth="16"
        strokeDasharray="301.59 301.59"
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
    </svg>
  )
}
