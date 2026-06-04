import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { IdentificationContent } from '../components/account/IdentificationContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function IdentificationPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <IdentificationContent />
    </DashboardLayout>
  )
}
