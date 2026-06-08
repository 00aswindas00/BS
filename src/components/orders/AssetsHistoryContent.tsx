import { useState, Fragment } from 'react'
import { Download, ChevronDown, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import { EmptyTableState } from '../shared/EmptyTableState'
import { usePortfolioStore } from '../../hooks/usePortfolioStore'

const HISTORY_TABS = [
  'Overview',
  'Deposit',
  'Withdraw',
  'Transfer',
  'Distribution',
  'Referral',
  'Others',
] as const

const PAGE_SIZE = 8

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

export function AssetsHistoryContent() {
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const [typeFilter, setTypeFilter] = useState('Overall')
  const [timeFilter, setTimeFilter] = useState('Past 30 days')
  const [assetFilter, setAssetFilter] = useState('All')
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { transactions: allRecords } = usePortfolioStore()

  // Filter by tab
  const tabFiltered = activeTab === 'Overview'
    ? allRecords
    : activeTab === 'Deposit'
      ? allRecords.filter((r) => r.kind === 'Deposit')
      : activeTab === 'Withdraw'
        ? allRecords.filter((r) => r.kind === 'Withdraw')
        : []

  const records = tabFiltered.filter((record) => {
    if (typeFilter !== 'Overall' && record.kind !== typeFilter) return false
    if (assetFilter !== 'All' && record.coin !== assetFilter) return false

    const ageMs = Date.now() - new Date(record.completedAt).getTime()
    const days = ageMs / (1000 * 60 * 60 * 24)

    if (timeFilter === 'Past 7 days') return days <= 7
    if (timeFilter === 'Past 30 days') return days <= 30
    if (timeFilter === 'Past 90 days') return days <= 90
    if (timeFilter === 'Past 1 year') return days <= 365
    return true
  })

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE))
  const paginatedRecords = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleReset() {
    setTypeFilter('Overall')
    setTimeFilter('Past 30 days')
    setAssetFilter('All')
    setPage(0)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-card-border">
        <div className="flex gap-6 overflow-x-auto">
          {HISTORY_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActiveTab(tab); setPage(0) }}
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
        <button
          type="button"
          className="mb-3 flex h-9 w-9 items-center justify-center rounded border border-input-border text-muted transition-colors hover:border-input-hover hover:text-text"
          aria-label="Download"
        >
          <Download size={18} />
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <FilterDropdown label="Type" value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(0) }} />
        <FilterDropdown label="Time" value={timeFilter} onChange={(v) => { setTimeFilter(v); setPage(0) }} />
        <FilterDropdown label="Asset" value={assetFilter} onChange={(v) => { setAssetFilter(v); setPage(0) }} />
        <button
          type="button"
          onClick={handleReset}
          className="h-10 rounded-md border border-input-border bg-card px-5 text-sm font-medium text-text transition-colors hover:border-input-hover hover:bg-sidebar-active"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-card">
        {records.length === 0 ? (
          <EmptyTableState />
        ) : (
          <>
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-card-border text-xs text-muted">
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Time (UTC+8)</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Type</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Coin</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Network</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal text-right">Amount</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal">Status</th>
                  <th className="whitespace-nowrap px-4 py-3 font-normal w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record) => {
                  const isExpanded = expandedId === record.id
                  return (
                    <Fragment key={record.id}>
                      <tr
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
                        <td className="whitespace-nowrap px-4 py-3 text-right text-text">
                          <span className={record.kind === 'Deposit' ? 'text-success' : 'text-error'}>
                            {record.kind === 'Deposit' ? '+' : '-'}
                          </span>
                          {fmtQty(record.qty)}
                        </td>
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
                          <ChevronDown
                            size={16}
                            className={`text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${record.id}-detail`} className="border-b border-card-border bg-sidebar-active/20">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                              <DetailItem label="Fee" value={fmtQty(record.fee)} />
                              <DetailItem label="Address" value={record.address} copyable />
                              <DetailItem label="TxID" value={record.txid} copyable />
                              <DetailItem
                                label="Completed"
                                value={record.status === 'Completed'
                                  ? record.completedAt.slice(0, 19).replace('T', ' ')
                                  : '--'}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-card-border px-4 py-2">
              <span className="text-xs text-muted">
                {records.length} record{records.length !== 1 ? 's' : ''} found
              </span>
              <div className="flex items-center gap-2">
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
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function DetailItem({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) {
  return (
    <div>
      <p className="mb-0.5 text-xs text-muted">{label}</p>
      <div className="flex items-center gap-1.5">
        <span className="break-all text-xs text-text">{value}</span>
        {copyable && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); copyToClipboard(value) }}
            className="shrink-0 text-muted transition-colors hover:text-accent"
            aria-label={`Copy ${label}`}
          >
            <Copy size={12} />
          </button>
        )}
      </div>
    </div>
  )
}

function FilterDropdown({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const options =
    label === 'Type'
      ? ['Overall', 'Deposit', 'Withdraw', 'Transfer']
      : label === 'Time'
        ? ['Past 7 days', 'Past 30 days', 'Past 90 days', 'Past 1 year']
        : ['All', 'BTC', 'ETH', 'USDT', 'TRX']

  return (
    <div className="relative min-w-[140px]">
      <span className="mb-1.5 block text-xs text-muted">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-full min-w-[160px] items-center justify-between rounded-md border border-input-border bg-card px-3 text-sm text-text transition-colors hover:border-input-hover"
      >
        {value}
        <ChevronDown size={16} className="text-muted" />
      </button>
      {open && (
        <ul className="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-md border border-card-border bg-card py-1 shadow-lg">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-active ${
                  value === opt ? 'text-accent' : 'text-text'
                }`}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
