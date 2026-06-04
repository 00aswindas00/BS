import { useState } from 'react'
import { GitBranch } from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function SubAccountsPage() {
  const session = useAuthGuard()
  const [toast, setToast] = useState(false)
  if (!session) return null

  function handleCreate() {
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <div className="rounded-xl border border-card-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sidebar-active">
          <GitBranch size={32} className="text-muted" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-text">Sub Accounts</h1>
        <p className="mb-6 text-sm text-muted">
          You don&apos;t have any sub-accounts.
        </p>
        <button
          type="button"
          onClick={handleCreate}
          className="mx-auto flex h-10 items-center justify-center rounded-lg bg-accent px-6 text-sm font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          Create Sub Account
        </button>

        {toast && (
          <p className="mt-4 rounded-lg border border-card-border bg-page px-3 py-2 text-center text-xs text-muted">
            Unavailable at the moment. Please try again later.
          </p>
        )}
      </div>
    </DashboardLayout>
  )
}
