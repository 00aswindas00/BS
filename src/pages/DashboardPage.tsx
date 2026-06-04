import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { UserProfileHeader } from '../components/dashboard/UserProfileHeader'
import { EstimatedValueCard } from '../components/dashboard/EstimatedValueCard'
import { MarketsCard } from '../components/dashboard/MarketsCard'
import { DiscoverCard } from '../components/dashboard/DiscoverCard'
import { AnnouncementsCard } from '../components/dashboard/AnnouncementsCard'
import { SquareCard } from '../components/dashboard/SquareCard'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function DashboardPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <DashboardLayout>
      <UserProfileHeader />
      <EstimatedValueCard />

      {/* Markets – full width on all screens */}
      <MarketsCard />

      {/* Discover (left) + Announcements (right) – stacked on mobile, side-by-side on desktop */}
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[3fr_2fr]">
        <DiscoverCard />
        <AnnouncementsCard />
      </div>

      <SquareCard />
    </DashboardLayout>
  )
}
