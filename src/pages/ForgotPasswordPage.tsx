import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { BinanceLogo } from '../icons/BinanceLogo'
import { SiteFooter } from '../components/SiteFooter'
import { validateEmailOrPhone } from '../lib/validation'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const result = validateEmailOrPhone(email)
    if (!result.valid) {
      setError(result.message)
      return
    }
    setError(undefined)
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-page px-4 pb-24">
      <main className="w-full max-w-[448px] rounded-3xl border border-card-border bg-card p-8">
        <div className="mb-6">
          <BinanceLogo size="md" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-text">Reset password</h1>
        <p className="mb-6 text-sm text-muted">
          Enter your email or phone number and we&apos;ll send reset instructions.
        </p>

        {submitted ? (
          <div className="rounded-lg border border-card-border bg-page p-4 text-center">
            <p className="text-sm text-text">
              If an account exists for <strong>{email.trim()}</strong>, you will receive
              instructions shortly.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              Back to Log in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="reset-email" className="mb-1.5 block text-sm text-muted">
              Email/Phone number
            </label>
            <input
              id="reset-email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email/Phone (without country code)"
              className={`h-12 w-full rounded-lg border bg-page px-3 text-sm text-text outline-none transition-colors placeholder:text-muted hover:border-input-hover focus:border-accent ${
                error ? 'border-error' : 'border-input-border'
              }`}
            />
            {error && (
              <p className="mt-1.5 text-xs text-error" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-black transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {loading ? (
                <span className="spinner inline-block h-5 w-5 rounded-full border-2 border-black/30 border-t-black" />
              ) : (
                'Continue'
              )}
            </button>
          </form>
        )}

        {!submitted && (
          <Link
            to="/"
            className="mt-4 block text-center text-sm font-medium text-accent hover:underline"
          >
            Back to Log in
          </Link>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
