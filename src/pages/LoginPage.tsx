import { LoginCard } from '../components/LoginCard'
import { AccountLinks } from '../components/AccountLinks'
import { SiteFooter } from '../components/SiteFooter'

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-page px-4 pb-24">
      <LoginCard />
      <AccountLinks />
      <SiteFooter />
    </div>
  )
}
