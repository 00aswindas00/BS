import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { MarginContent } from '../components/wallet/MarginContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function AssetsMarginPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <MarginContent />
    </DashboardLayout>
  )
}
