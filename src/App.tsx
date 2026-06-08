import { Routes, Route } from 'react-router-dom'
import { PageTransition } from './components/PageTransition'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { DashboardPage } from './pages/DashboardPage'
import { AssetsOverviewPage } from './pages/AssetsOverviewPage'
import { AssetsSpotPage } from './pages/AssetsSpotPage'
import { AssetsMarginPage } from './pages/AssetsMarginPage'
import { AssetsFundingPage } from './pages/AssetsFundingPage'
import { AssetsHistoryPage } from './pages/AssetsHistoryPage'
import { SpotOrderPage } from './pages/SpotOrderPage'
import { P2POrderPage } from './pages/P2POrderPage'
import { PaymentHistoryPage } from './pages/PaymentHistoryPage'
import { IdentificationPage } from './pages/IdentificationPage'
import { SecurityPage } from './pages/SecurityPage'
import { PaymentAccountPage } from './pages/PaymentAccountPage'
import { ApiManagementPage } from './pages/ApiManagementPage'
import { AccountStatementPage } from './pages/AccountStatementPage'
import { FinancialReportsPage } from './pages/FinancialReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { DepositCryptoPage } from './pages/DepositCryptoPage'
import { WithdrawCryptoPage } from './pages/WithdrawCryptoPage'
import { TransferFiatPlaceholderPage } from './pages/TransferFiatPlaceholderPage'
import { SectionPlaceholderPage } from './pages/SectionPlaceholderPage'
import { RewardsPage } from './pages/RewardsPage'
import { SubAccountsPage } from './pages/SubAccountsPage'
import { AdminPage } from './pages/AdminPage'

export default function App() {
  return (
    <PageTransition>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      <Route path="/assets/overview" element={<AssetsOverviewPage />} />
      <Route path="/assets/spot" element={<AssetsSpotPage />} />
      <Route path="/assets/margin" element={<AssetsMarginPage />} />
      <Route path="/assets/funding" element={<AssetsFundingPage />} />
      <Route path="/assets/:section" element={<SectionPlaceholderPage />} />

      <Route path="/orders/assets-history" element={<AssetsHistoryPage />} />
      <Route path="/orders/spot" element={<SpotOrderPage />} />
      <Route path="/orders/p2p" element={<P2POrderPage />} />
      <Route path="/orders/payment" element={<PaymentHistoryPage />} />
      <Route path="/orders/:section" element={<SectionPlaceholderPage />} />

      <Route path="/account/identification" element={<IdentificationPage />} />
      <Route path="/account/security" element={<SecurityPage />} />
      <Route path="/account/payment" element={<PaymentAccountPage />} />
      <Route path="/account/api" element={<ApiManagementPage />} />
      <Route path="/account/statement" element={<AccountStatementPage />} />
      <Route path="/account/reports" element={<FinancialReportsPage />} />
      <Route path="/account/:section" element={<SectionPlaceholderPage />} />

      <Route path="/rewards" element={<RewardsPage />} />
      <Route path="/referral" element={<SectionPlaceholderPage />} />
      <Route path="/sub-accounts" element={<SubAccountsPage />} />
      <Route path="/settings" element={<SettingsPage />} />

      <Route path="/deposit/crypto" element={<DepositCryptoPage />} />
      <Route path="/deposit/fiat" element={<TransferFiatPlaceholderPage />} />
      <Route path="/withdraw/crypto" element={<WithdrawCryptoPage />} />
      <Route path="/withdraw/fiat" element={<TransferFiatPlaceholderPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
    </PageTransition>
  )
}
