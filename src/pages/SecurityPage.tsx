import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { SecurityContent } from '../components/account/SecurityContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function SecurityPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <SecurityContent />
    </DashboardLayout>
  )
}
