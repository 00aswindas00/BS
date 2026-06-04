import { useState } from 'react'
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
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

const PAGE_SIZE = 8

export function PaymentHistoryContent() {
  const [type, setType] = useState('All')
  const [typeOpen, setTypeOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { transactions } = usePortfolioStore()
  const records = transactions.filter((record) =>
    type === 'All' ? true : type === 'Received' ? record.kind === 'Deposit' : record.kind === 'Withdraw',
  )
  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE))
  const paginatedRecords = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="relative min-w-[120px]">
          <span className="mb-1.5 block text-xs text-muted">Type</span>
          <button
            type="button"
            onClick={() => setTypeOpen((v) => !v)}
            className="flex h-10 min-w-[140px] items-center justify-between rounded-md border border-input-border bg-card px-3 text-sm text-text"
          >
            {type}
            <ChevronDown size={16} className="text-muted" />
          </button>
          {typeOpen && (
            <ul className="absolute top-full z-20 mt-1 w-full rounded-md border border-card-border bg-card py-1 shadow-lg">
              {['All', 'Received', 'Sent'].map((opt) => (
                <li key={opt}>
                  <button
                    type="button"
                    onClick={() => {
                      setType(opt)
                      setTypeOpen(false)
                      setPage(0)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-sidebar-active"
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="min-w-[240px] flex-1">
          <span className="mb-1.5 block text-xs text-muted">Date</span>
          <div className="relative">
            <input
              type="text"
              readOnly
              placeholder="YYYY-MM-DD  →  YYYY-MM-DD"
              className="h-10 w-full rounded-md border border-input-border bg-card px-3 pr-10 text-sm text-muted outline-none"
            />
            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </div>
        <button
          type="button"
          className="h-10 px-4 text-sm text-muted transition-colors hover:text-text"
        >
          Reset
        </button>
        <button
          type="button"
          className="h-10 rounded-md bg-accent px-6 text-sm font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-card">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted">
              <th className="whitespace-nowrap px-4 py-3 font-normal">Time</th>
              <th className="whitespace-nowrap px-4 py-3 font-normal">Type</th>
              <th className="whitespace-nowrap px-4 py-3 font-normal">Network</th>
              <th className="whitespace-nowrap px-4 py-3 font-normal text-right">Amount</th>
              <th className="whitespace-nowrap px-4 py-3 font-normal">Currency</th>
              <th className="whitespace-nowrap px-4 py-3 font-normal">Status</th>
              <th className="whitespace-nowrap px-4 py-3 font-normal w-10"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.map((record) => {
              const isExpanded = expandedId === record.id
              return (
                <>
                  <tr
                    key={record.id}
                    className="cursor-pointer border-t border-card-border transition-colors hover:bg-sidebar-active/30"
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-text">{record.time}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        record.kind === 'Deposit'
                          ? 'bg-success/15 text-success'
                          : 'bg-error/15 text-error'
                      }`}>
                        {record.kind === 'Deposit' ? 'Received' : 'Sent'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-muted">{record.networkId ?? '--'}</td>
                    <td className={`whitespace-nowrap px-4 py-4 text-right ${record.kind === 'Deposit' ? 'text-success' : 'text-error'}`}>
                      {record.kind === 'Deposit' ? '+' : '-'}
                      {fmtQty(record.qty)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-text">{record.coin}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                        record.status === 'Pending Approval' ? 'text-accent' : 'text-text'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          record.status === 'Pending Approval' ? 'bg-accent' : 'bg-success'
                        }`} />
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <ChevronDown
                        size={16}
                        className={`text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${record.id}-detail`} className="border-t border-card-border bg-sidebar-active/20">
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
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-card-border px-4 py-2">
            <span className="text-xs text-muted">
              {records.length} record{records.length !== 1 ? 's' : ''}
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
      </div>
    </div>
  )
}
