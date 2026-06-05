import type { ReactNode } from 'react'
import { NotificationBanner } from './NotificationBanner'
import { DashboardHeader } from './DashboardHeader'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardFooter } from './DashboardFooter'
import { WalletFooter } from './WalletFooter'

type DashboardLayoutProps = {
  children: ReactNode
  footer?: 'full' | 'wallet'
  showBanner?: boolean
}

export function DashboardLayout({
  children,
  footer = 'full',
  showBanner = true,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-page">
      {showBanner && <NotificationBanner />}
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <div className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto max-w-[1280px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8">{children}</div>
          {footer === 'wallet' ? <WalletFooter /> : <DashboardFooter />}
        </div>
      </div>
    </div>
  )
}
