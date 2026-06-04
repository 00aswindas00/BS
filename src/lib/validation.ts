export type ValidationResult =
  | { valid: true; type: 'email' | 'phone' }
  | { valid: false; message: string }

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function validateEmailOrPhone(value: string): ValidationResult {
  const trimmed = value.trim()

  if (!trimmed) {
    return { valid: false, message: 'Please enter your email or phone number.' }
  }

  if (trimmed.includes('@')) {
    if (!EMAIL_REGEX.test(trimmed)) {
      return { valid: false, message: 'Please enter a valid email address.' }
    }
    return { valid: true, type: 'email' }
  }

  const digits = trimmed.replace(/^\+/, '').replace(/\D/g, '')

  if (digits.length < 7 || digits.length > 15) {
    return {
      valid: false,
      message: 'Please enter a valid phone number (7–15 digits, no country code).',
    }
  }

  return { valid: true, type: 'phone' }
}

export function isEmailOrPhoneValid(value: string): boolean {
  return validateEmailOrPhone(value).valid
}
