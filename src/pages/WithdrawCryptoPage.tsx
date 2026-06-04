import { WalletTransferLayout } from '../components/transfer/WalletTransferLayout'
import { WithdrawCryptoContent } from '../components/transfer/WithdrawCryptoContent'
import { WithdrawFaq } from '../components/transfer/WithdrawFaq'
import { RecentWithdrawals } from '../components/transfer/RecentWithdrawals'
import { useAuthGuard } from '../hooks/useAuthGuard'

export function WithdrawCryptoPage() {
  const session = useAuthGuard()
  if (!session) return null

  return (
    <WalletTransferLayout faq={<WithdrawFaq />} recent={<RecentWithdrawals />}>
      <WithdrawCryptoContent />
    </WalletTransferLayout>
  )
}
