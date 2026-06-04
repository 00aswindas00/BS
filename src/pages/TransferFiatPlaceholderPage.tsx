import { Link, useLocation } from 'react-router-dom'
import { WalletTransferLayout } from '../components/transfer/WalletTransferLayout'
import { DepositFaq } from '../components/transfer/DepositFaq'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function TransferFiatPlaceholderPage() {
  const session = useAuthGuard()
  const { pathname } = useLocation()
  if (!session) return null

  const isDeposit = pathname.includes('deposit')

  return (
    <WalletTransferLayout
      faq={<DepositFaq />}
      recent={
        <div className="rounded-xl border border-card-border bg-card p-8 text-center">
          <p className="text-muted">Fiat transfers coming soon.</p>
          <Link to="/deposit/crypto" className="mt-4 inline-block text-sm text-accent hover:underline">
            Go to Deposit Crypto
          </Link>
        </div>
      }
    >
      <h1 className="mb-4 text-2xl font-semibold text-text">
        {isDeposit ? 'Deposit Fiat' : 'Withdraw Fiat'}
      </h1>
      <p className="text-muted">This section is not available in the demo yet.</p>
    </WalletTransferLayout>
  )
}
