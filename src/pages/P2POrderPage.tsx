import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { P2POrderContent } from '../components/orders/P2POrderContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function P2POrderPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <P2POrderContent />
    </DashboardLayout>
  )
}
