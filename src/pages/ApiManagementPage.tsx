import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { ApiManagementContent } from '../components/account/ApiManagementContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function ApiManagementPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <ApiManagementContent />
    </DashboardLayout>
  )
}
