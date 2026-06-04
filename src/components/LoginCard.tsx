import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { LoadingScreen } from './shared/LoadingScreen'
import { BinanceLogo } from '../icons/BinanceLogo'
import { QrIcon } from '../icons/QrIcon'
import { PasskeyIcon } from '../icons/PasskeyIcon'
import { GoogleIcon } from '../icons/GoogleIcon'
import { AppleIcon } from '../icons/AppleIcon'
import { TelegramIcon } from '../icons/TelegramIcon'
import { EmailPhoneField } from './EmailPhoneField'
import { SocialAuthButton } from './SocialAuthButton'
import { QrLoginPanel } from './QrLoginPanel'
import { validateEmailOrPhone, isEmailOrPhoneValid } from '../lib/validation'
import {
  verifyEmail,
  verifyPassword,
  maskEmail,
  socialLogin,
  type SocialProvider,
} from '../lib/authMock'

type Step = 'email' | 'password'

export function LoginCard() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')

  // Step 1 – email
  const [identifier, setIdentifier] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [showQr, setShowQr] = useState(false)
  const [touched, setTouched] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  // Step 2 – password
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [pwError, setPwError] = useState<string | undefined>()
  const [pwShake, setPwShake] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)

  const isValid = isEmailOrPhoneValid(identifier)

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  function triggerShake(target: 'email' | 'password') {
    if (target === 'email') {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    } else {
      setPwShake(true)
      setTimeout(() => setPwShake(false), 400)
    }
  }

  function validateField(): boolean {
    const result = validateEmailOrPhone(identifier)
    if (result.valid === false) {
      setError(result.message)
      triggerShake('email')
      return false
    }
    setError(undefined)
    return true
  }

  // Step 1 submit – verify email, then move to password step
  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!validateField()) return

    setLoading(true)
    try {
      const email = await verifyEmail(identifier)
      setVerifiedEmail(email)
      setStep('password')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      triggerShake('email')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 submit – verify password, then show 2-sec loading before navigating
  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    if (!password) {
      setPwError('Please enter your password.')
      triggerShake('password')
      return
    }

    setPwLoading(true)
    setPwError(undefined)
    try {
      await verifyPassword(verifiedEmail, password)
      setPwLoading(false)
      setLoginLoading(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Something went wrong.')
      triggerShake('password')
      setPwLoading(false)
    }
  }

  async function handleSocial(provider: SocialProvider, label: string) {
    setSocialLoading(provider)
    showToast(`Redirecting to ${label}…`)
    try {
      await socialLogin(provider)
      setSocialLoading(null)
      setLoginLoading(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch {
      showToast(`Unable to connect with ${label}. Please try again.`)
      setSocialLoading(null)
    }
  }

  const socialDisabled = loading || socialLoading !== null

  // ─── Full-screen loading after successful login ───
  if (loginLoading) {
    return <LoadingScreen visible={true} />
  }

  // ─── Password Step UI ───
  if (step === 'password') {
    return (
      <main className="w-full max-w-[380px] rounded-2xl border border-card-border bg-card p-4 sm:p-5">
        <div className="mb-5">
          <BinanceLogo size="md" />
        </div>

        <h1 className="mb-4 text-xl font-semibold text-text sm:text-[22px]">
          Enter your password
        </h1>

        {/* Masked email */}
        <p className="mb-5 text-sm text-muted">{maskEmail(verifiedEmail)}</p>

        <form onSubmit={handlePasswordSubmit} noValidate>
          <label className="mb-1.5 block text-sm text-muted" htmlFor="pw-input">
            Password
          </label>
          <div
            className={`flex h-12 items-center rounded-lg border bg-page px-4 transition-colors ${
              pwError ? 'border-error' : 'border-input-border focus-within:border-input-hover'
            } ${pwShake ? 'shake' : ''}`}
          >
            <input
              id="pw-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (pwError) setPwError(undefined)
              }}
              autoFocus
              autoComplete="current-password"
              placeholder=""
              className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="ml-2 text-muted transition-colors hover:text-text"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {pwError && (
            <p className="mt-2 text-sm text-error">{pwError}</p>
          )}

          <button
            type="submit"
            disabled={!password || pwLoading}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-black transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {pwLoading ? (
              <span className="spinner inline-block h-5 w-5 rounded-full border-2 border-black/30 border-t-black" />
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <div className="mt-5 flex flex-col gap-3 text-sm">
          <button
            type="button"
            className="text-accent transition-colors hover:underline"
            onClick={() => showToast('Password reset flow coming soon.')}
          >
            Forgot password?
          </button>
          <button
            type="button"
            className="text-accent transition-colors hover:underline"
            onClick={() => showToast('Passkey login coming soon.')}
          >
            Use passkey to log in
          </button>
        </div>
      </main>
    )
  }

  // ─── Email Step UI (original) ───
  return (
    <main className="w-full max-w-[380px] rounded-2xl border border-card-border bg-card p-4 sm:p-5">
      <div className="mb-5">
        <BinanceLogo size="md" />
      </div>

      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text sm:text-[22px]">Log in</h1>
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          aria-label="Log in with QR code"
          aria-pressed={showQr}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-text transition-colors hover:bg-card-border ${
            showQr ? 'border-accent bg-card-border' : 'border-card-border bg-page'
          }`}
        >
          <QrIcon />
        </button>
      </div>

      {showQr ? (
        <QrLoginPanel />
      ) : (
        <form onSubmit={handleEmailSubmit} noValidate>
          <EmailPhoneField
            value={identifier}
            onChange={(v) => {
              setIdentifier(v)
              if (touched && error) {
                const result = validateEmailOrPhone(v)
                setError(result.valid === false ? result.message : undefined)
              }
            }}
            onBlur={() => {
              setTouched(true)
              if (identifier.trim()) validateField()
            }}
            error={touched ? error : undefined}
            shake={shake}
          />

          <button
            type="submit"
            disabled={!isValid || loading || socialDisabled}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-accent text-sm font-semibold text-black transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="spinner inline-block h-5 w-5 rounded-full border-2 border-black/30 border-t-black" />
            ) : (
              'Continue'
            )}
          </button>

          <div className="relative my-6 flex items-center">
            <div className="h-px flex-1 bg-input-border" />
            <span className="px-4 text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-input-border" />
          </div>

          <div className="flex flex-col gap-3">
            <SocialAuthButton
              icon={<PasskeyIcon className="text-text" />}
              label="Continue with Passkey"
              disabled={socialDisabled}
              onClick={() => handleSocial('passkey', 'Passkey')}
            />
            <SocialAuthButton
              icon={<GoogleIcon />}
              label="Continue with Google"
              disabled={socialDisabled}
              onClick={() => handleSocial('google', 'Google')}
            />
            <SocialAuthButton
              icon={<AppleIcon className="text-text" />}
              label="Continue with Apple"
              disabled={socialDisabled}
              onClick={() => handleSocial('apple', 'Apple')}
            />
            <SocialAuthButton
              icon={<TelegramIcon />}
              label="Continue with Telegram"
              disabled={socialDisabled}
              onClick={() => handleSocial('telegram', 'Telegram')}
            />
          </div>
        </form>
      )}

      {toast && (
        <p
          role="status"
          className="mt-4 rounded-lg border border-card-border bg-page px-3 py-2 text-center text-xs text-muted"
        >
          {toast}
        </p>
      )}
    </main>
  )
}
