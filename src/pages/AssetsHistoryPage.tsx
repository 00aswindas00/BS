import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { AssetsHistoryContent } from '../components/orders/AssetsHistoryContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function AssetsHistoryPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <AssetsHistoryContent />
    </DashboardLayout>
  )
}
