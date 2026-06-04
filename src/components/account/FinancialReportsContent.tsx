import { RefreshCw } from 'lucide-react'
import { EmptyTableState } from '../shared/EmptyTableState'

export function FinancialReportsContent() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text">Financial Reports</h1>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-md border border-input-border bg-card px-4 text-sm text-text hover:bg-sidebar-active"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
      <div className="rounded-xl border border-card-border bg-card">
        <EmptyTableState message="There are no documents generated for you at this time." />
      </div>
    </div>
  )
}
