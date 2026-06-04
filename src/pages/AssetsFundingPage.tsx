import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { FundingContent } from '../components/wallet/FundingContent'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function AssetsFundingPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <FundingContent />
    </DashboardLayout>
  )
}
