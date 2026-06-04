import { Gift } from 'lucide-react'
import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function RewardsPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <div className="rounded-xl border border-card-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sidebar-active">
          <Gift size={32} className="text-muted" />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-text">Rewards Hub</h1>
        <p className="mb-6 text-sm text-muted">
          You don&apos;t have any rewards unlocked yet.
        </p>
        <p className="text-xs text-muted/70">
          Complete tasks and promotions to earn rewards.
        </p>
      </div>
    </DashboardLayout>
  )
}
