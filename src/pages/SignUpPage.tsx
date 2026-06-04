import { Link } from 'react-router-dom'
import { BinanceLogo } from '../icons/BinanceLogo'
import { SiteFooter } from '../components/SiteFooter'

export function SignUpPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-page px-4 pb-24">
      <main className="w-full max-w-[448px] rounded-3xl border border-card-border bg-card p-8 text-center">
        <div className="mb-6 flex justify-center">
          <BinanceLogo size="md" className="object-center" />
        </div>
        <h1 className="mb-3 text-2xl font-semibold text-text">Create Account</h1>
        <p className="mb-6 text-sm text-muted">
          Sign-up flow coming soon. Provide the next screenshot to build this page.
        </p>
        <Link
          to="/"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-accent px-8 text-sm font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          Back to Log in
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}
