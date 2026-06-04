import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { FinancialReportsContent } from '../components/account/FinancialReportsContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function FinancialReportsPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <FinancialReportsContent />
    </DashboardLayout>
  )
}
