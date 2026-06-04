import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { SpotBalanceSummary } from '../components/wallet/SpotBalanceSummary'
import { SpotAssetsTable } from '../components/wallet/SpotAssetsTable'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function AssetsSpotPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <SpotBalanceSummary />
      <SpotAssetsTable />
    </DashboardLayout>
  )
}
