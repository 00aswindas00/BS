import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { BalanceOverview } from '../components/wallet/BalanceOverview'
import { MyAssetsSection } from '../components/wallet/MyAssetsSection'
import { FeatureCards } from '../components/wallet/FeatureCards'
import { RecentTransactions } from '../components/wallet/RecentTransactions'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function AssetsOverviewPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <BalanceOverview />
      <MyAssetsSection />
      <FeatureCards />
      <RecentTransactions />
    </DashboardLayout>
  )
}
