import { clearSessionCache, initialSync } from './portfolioStore'

export type SocialProvider = 'passkey' | 'google' | 'apple' | 'telegram'

const AUTH_DELAY_MS = 600

const VALID_EMAIL = 'sunilkryptousdt@gmail.com'
const VALID_PASSWORD = 'sunil@9964'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Mask an email like n****@gmail.com */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 1)
  return `${visible}${'*'.repeat(Math.max(local.length - 1, 3))}@${domain}`
}

/** Step 1: verify the email exists (simulate account lookup) */
export async function verifyEmail(identifier: string): Promise<string> {
  await delay(AUTH_DELAY_MS)

  const trimmed = identifier.trim().toLowerCase()
  if (trimmed !== VALID_EMAIL) {
    throw new Error('Account not found. Please check your email or phone number.')
  }

  return trimmed
}

/** Step 2: verify password for a previously verified email */
export async function verifyPassword(email: string, password: string): Promise<void> {
  await delay(AUTH_DELAY_MS)

  if (email.toLowerCase() !== VALID_EMAIL || password !== VALID_PASSWORD) {
    throw new Error('Incorrect password. Please try again.')
  }

  sessionStorage.setItem(
    'bclone_auth',
    JSON.stringify({
      method: 'email',
      identifier: email,
      loggedInAt: new Date().toISOString(),
    }),
  )

  // Clear any stale session cache so the fresh login fetches from DB
  clearSessionCache()
  // Fire-and-forget: load balances + transactions from DB
  void initialSync()
}

export async function socialLogin(provider: SocialProvider): Promise<void> {
  await delay(AUTH_DELAY_MS)

  sessionStorage.setItem(
    'bclone_auth',
    JSON.stringify({
      method: provider,
      identifier: provider,
      loggedInAt: new Date().toISOString(),
    }),
  )

  clearSessionCache()
  void initialSync()
}

export function getAuthSession(): {
  method: string
  identifier: string
  loggedInAt: string
} | null {
  const raw = sessionStorage.getItem('bclone_auth')
  if (!raw) return null
  try {
    return JSON.parse(raw) as {
      method: string
      identifier: string
      loggedInAt: string
    }
  } catch {
    return null
  }
}

export function clearAuthSession(): void {
  sessionStorage.removeItem('bclone_auth')
  clearSessionCache()
}
