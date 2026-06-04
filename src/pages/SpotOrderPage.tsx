import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { EmptyTableState } from '../components/shared/EmptyTableState'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function SpotOrderPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <h1 className="mb-6 text-xl font-semibold text-text">Spot Order</h1>
      <div className="rounded-xl border border-card-border bg-card">
        <EmptyTableState />
      </div>
    </DashboardLayout>
  )
}
