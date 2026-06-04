import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { SettingsContent } from '../components/account/SettingsContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function SettingsPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="full" showBanner={false}>
      <SettingsContent />
    </DashboardLayout>
  )
}
