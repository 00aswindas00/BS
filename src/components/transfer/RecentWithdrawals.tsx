import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { EmptyTableState } from '../shared/EmptyTableState'
import { usePortfolioStore } from '../../hooks/usePortfolioStore'

/** Format qty: max 6 integer digits + 4 decimal places */
function fmtQty(value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return value
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })
}

const PAGE_SIZE = 5

export function RecentWithdrawals() {
  const [tab, setTab] = useState<'address' | 'user'>('address')
  const [page, setPage] = useState(0)
  const { transactions } = usePortfolioStore()
  const withdrawals = transactions.filter((record) => record.kind === 'Withdraw')
  const totalPages = Math.max(1, Math.ceil(withdrawals.length / PAGE_SIZE))
  const records = withdrawals.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-text">Recent Withdrawals</h2>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="h-4 w-4 accent-accent" />
            Hide error notices
          </label>
          <button
            type="button"
            className="flex items-center gap-0.5 text-sm text-muted transition-colors hover:text-accent"
          >
            More
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="mb-4 inline-flex rounded-md bg-sidebar-active p-0.5">
        {(['address', 'user'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded px-4 py-1.5 text-sm ${
              tab === t ? 'bg-card font-medium text-text' : 'text-muted'
            }`}
          >
            {t === 'address' ? 'Address' : 'Binance user'}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-card-border bg-card">
        {withdrawals.length === 0 ? (
          <EmptyTableState message="No recent withdraw record." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-card-border text-xs text-muted">
                    <th className="whitespace-nowrap px-4 py-3 font-normal">Time (UTC+8)</th>
                    <th className="whitespace-nowrap px-4 py-3 font-normal">Coin</th>
                    <th className="whitespace-nowrap px-4 py-3 font-normal">Network</th>
                    <th className="whitespace-nowrap px-4 py-3 font-normal text-right">Amount</th>
                    <th className="whitespace-nowrap px-4 py-3 font-normal text-right">Fee</th>
                    <th className="whitespace-nowrap px-4 py-3 font-normal">Address</th>
                    <th className="whitespace-nowrap px-4 py-3 font-normal">TxID</th>
                    <th className="whitespace-nowrap px-4 py-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-card-border last:border-b-0">
                      <td className="whitespace-nowrap px-4 py-3 text-text">{record.time}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-text">{record.coin}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">{record.networkId ?? '--'}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-text">{fmtQty(record.qty)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-muted">{fmtQty(record.fee)}</td>
                      <td className="max-w-[140px] truncate px-4 py-3 text-muted" title={record.address}>
                        {record.address}
                      </td>
                      <td className="max-w-[160px] truncate px-4 py-3 text-muted" title={record.txid}>
                        {record.txid}
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 ${
                          record.status === 'Pending Approval'
                            ? 'text-accent'
                            : record.status === 'Rejected'
                              ? 'text-error'
                              : 'text-success'
                        }`}
                      >
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-2 border-t border-card-border px-4 py-2">
                <span className="text-xs text-muted">
                  {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="p-1 text-muted transition-colors hover:text-text disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="p-1 text-muted transition-colors hover:text-text disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
