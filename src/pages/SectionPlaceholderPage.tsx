import { Link, useLocation } from 'react-router-dom'
import { DashboardLayout } from '../components/dashboard/layout/DashboardLayout'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function SectionPlaceholderPage() {
  const session = useAuthGuard()
  const { pathname } = useLocation()
  if (!session) return null

  const title = pathname
    .split('/')
    .pop()
    ?.split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') ?? 'Page'

  const backPath = pathname.startsWith('/orders')
    ? '/orders/assets-history'
    : pathname.startsWith('/account')
      ? '/account/identification'
      : '/assets/overview'

  return (
    <DashboardLayout footer="wallet" showBanner={false}>
      <div className="rounded-xl border border-card-border bg-card p-8 text-center">
        <h1 className="mb-2 text-xl font-semibold text-text">{title}</h1>
        <p className="mb-6 text-sm text-muted">This section is coming soon.</p>
        <Link to={backPath} className="text-sm font-medium text-accent hover:underline">
          Go back
        </Link>
      </div>
    </DashboardLayout>
  )
}
