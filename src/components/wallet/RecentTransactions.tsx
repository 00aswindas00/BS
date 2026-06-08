import { useState } from 'react'
import { ChevronRight, ChevronLeft, Copy } from 'lucide-react'
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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {})
}

const PAGE_SIZE = 6

export function RecentTransactions() {
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { transactions } = usePortfolioStore()
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))
  const records = transactions.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <section className="rounded-xl border border-card-border bg-card">
      <div className="flex items-center justify-between border-b border-card-border px-4 py-4">
        <h2 className="text-lg font-semibold text-text">Recent Transactions</h2>
        <button
          type="button"
          className="flex items-center gap-0.5 text-sm text-muted transition-colors hover:text-accent"
        >
          More
          <ChevronRight size={16} />
        </button>
      </div>
      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-muted">No records</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-card-border text-xs text-muted">
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Time</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Type</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Coin</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Network</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal text-right">Qty</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal w-10"></th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const isExpanded = expandedId === record.id
                  return (
                    <>
                      <tr
                        key={record.id}
                        className="cursor-pointer border-b border-card-border last:border-b-0 transition-colors hover:bg-sidebar-active/30"
                        onClick={() => setExpandedId(isExpanded ? null : record.id)}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-text">{record.time}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                            record.kind === 'Deposit'
                              ? 'bg-success/15 text-success'
                              : 'bg-error/15 text-error'
                          }`}>
                            {record.kind}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-text">{record.coin}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-muted">{record.networkId ?? '--'}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-text">{fmtQty(record.qty)}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                            record.status === 'Pending Approval'
                              ? 'text-accent'
                              : record.status === 'Rejected'
                                ? 'text-error'
                                : 'text-success'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              record.status === 'Pending Approval'
                                ? 'bg-accent'
                                : record.status === 'Rejected'
                                  ? 'bg-error'
                                  : 'bg-success'
                            }`} />
                            {record.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight
                            size={14}
                            className={`text-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${record.id}-detail`} className="border-b border-card-border bg-sidebar-active/20">
                          <td colSpan={7} className="px-6 py-3">
                            <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                              <div>
                                <span className="text-muted">Fee: </span>
                                <span className="text-text">{fmtQty(record.fee)}</span>
                              </div>
                              <div>
                                <span className="text-muted">Address: </span>
                                <span className="text-text">{record.address}</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); copyToClipboard(record.address) }} className="ml-1 text-muted hover:text-accent"><Copy size={10} /></button>
                              </div>
                              <div>
                                <span className="text-muted">TxID: </span>
                                <span className="text-text">{record.txid}</span>
                                <button type="button" onClick={(e) => { e.stopPropagation(); copyToClipboard(record.txid) }} className="ml-1 text-muted hover:text-accent"><Copy size={10} /></button>
                              </div>
                              <div>
                                <span className="text-muted">Completed: </span>
                                <span className="text-text">{record.status === 'Completed' ? record.completedAt.slice(0, 19).replace('T', ' ') : '--'}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-card-border px-4 py-2">
              <span className="text-xs text-muted">
                {transactions.length} transactions
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{page + 1} / {totalPages}</span>
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
            </div>
          )}
        </>
      )}
    </section>
  )
}
