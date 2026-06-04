import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { PaymentAccountContent } from '../components/account/PaymentAccountContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function PaymentAccountPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <PaymentAccountContent />
    </DashboardLayout>
  )
}
