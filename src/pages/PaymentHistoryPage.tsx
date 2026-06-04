import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { PaymentHistoryContent } from '../components/orders/PaymentHistoryContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function PaymentHistoryPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <PaymentHistoryContent />
    </DashboardLayout>
  )
}
