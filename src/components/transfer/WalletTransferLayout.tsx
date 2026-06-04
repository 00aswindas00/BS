import type { ReactNode } from 'react'
import { Headphones } from 'lucide-react'
import { NotificationBanner } from '../dashboard/layout/NotificationBanner'
import { DashboardHeader } from '../dashboard/layout/DashboardHeader'
import { TransferSidebar } from './TransferSidebar'
import { SimpleTransferFooter } from './SimpleTransferFooter'

type WalletTransferLayoutProps = {
  children: ReactNode
  faq: ReactNode
  recent: ReactNode
}

export function WalletTransferLayout({ children, faq, recent }: WalletTransferLayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-page">
      <NotificationBanner />
      <DashboardHeader />
      <div className="flex w-full flex-col md:flex-row">
        <TransferSidebar />
        <div className="w-full min-w-0 flex-1 overflow-hidden">
          <div className="mx-auto w-full max-w-[1200px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
              <div className="min-w-0">{children}</div>
              <div className="lg:pt-2">{faq}</div>
            </div>
            <div className="mt-6 sm:mt-10">{recent}</div>
          </div>
          <SimpleTransferFooter />
        </div>
      </div>
      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-lg transition-transform hover:scale-105"
        aria-label="Support"
      >
        <Headphones size={22} className="text-black" />
      </button>
    </div>
  )
}
