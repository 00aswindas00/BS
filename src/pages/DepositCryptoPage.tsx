import { WalletTransferLayout } from '../components/transfer/WalletTransferLayout'
import { DepositCryptoContent } from '../components/transfer/DepositCryptoContent'
import { DepositFaq } from '../components/transfer/DepositFaq'
import { RecentDeposits } from '../components/transfer/RecentDeposits'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function DepositCryptoPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <WalletTransferLayout faq={<DepositFaq />} recent={<RecentDeposits />}>
      <DepositCryptoContent />
    </WalletTransferLayout>
  )
}
