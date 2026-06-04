import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { AccountStatementContent } from '../components/account/AccountStatementContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function AccountStatementPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <AccountStatementContent />
    </DashboardLayout>
  )
}
