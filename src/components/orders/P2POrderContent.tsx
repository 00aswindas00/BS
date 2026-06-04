import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { EmptyTableState } from '../shared/EmptyTableState'

const MAIN_TABS = ['Processing', 'All Orders'] as const
const STATUS_PILLS = ['All', 'Unpaid', 'Paid', 'Appeal'] as const

export function P2POrderContent() {
  const [mainTab, setMainTab] = useState<string>('Processing')
  const [statusPill, setStatusPill] = useState<string>('All')
  const [coins, setCoins] = useState('All coins')
  const [currency, setCurrency] = useState('All')
  const [orderType, setOrderType] = useState('All')
  const [search, setSearch] = useState('')

  function handleReset() {
    setCoins('All coins')
    setCurrency('All')
    setOrderType('All')
    setSearch('')
    setStatusPill('All')
  }

  return (
    <div>
      <div className="mb-4 flex gap-6 border-b border-card-border">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMainTab(tab)}
            className={`border-b-2 pb-3 text-sm transition-colors ${
              mainTab === tab
                ? 'border-accent font-medium text-text'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_PILLS.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => setStatusPill(pill)}
            className={`rounded-md px-4 py-1.5 text-sm transition-colors ${
              statusPill === pill
                ? 'bg-sidebar-active font-medium text-text'
                : 'text-muted hover:bg-sidebar-active hover:text-text'
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <FilterSelect label="Coins" value={coins} options={['All coins', 'USDT', 'BTC', 'BNB']} onChange={setCoins} />
        <FilterSelect label="Currency" value={currency} options={['All', 'USD', 'EUR', 'INR']} onChange={setCurrency} />
        <FilterSelect
          label="Order Type"
          value={orderType}
          options={['All', 'Buy', 'Sell']}
          onChange={setOrderType}
        />
        <div className="min-w-[200px] flex-1">
          <span className="mb-1.5 block text-xs text-muted">Search</span>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search order no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-md border border-input-border bg-card pl-9 pr-3 text-sm text-text outline-none placeholder:text-muted focus:border-accent"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="h-10 px-2 text-sm text-muted transition-colors hover:text-accent"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-card-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-card-border text-xs text-muted">
              <th className="px-4 py-3 font-normal">Type/Date</th>
              <th className="px-4 py-3 font-normal">Order number</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Fiat / Crypto Amount</th>
              <th className="px-4 py-3 font-normal">Counterparty</th>
              <th className="px-4 py-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6}>
                <EmptyTableState />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative min-w-[140px]">
      <span className="mb-1.5 block text-xs text-muted">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-full min-w-[140px] items-center justify-between rounded-md border border-input-border bg-card px-3 text-sm text-text hover:border-input-hover"
      >
        {value}
        <ChevronDown size={16} className="text-muted" />
      </button>
      {open && (
        <ul className="absolute top-full z-20 mt-1 w-full rounded-md border border-card-border bg-card py-1 shadow-lg">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt)
                  setOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-sidebar-active ${
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
