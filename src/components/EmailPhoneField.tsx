import { useId } from 'react'

type EmailPhoneFieldProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  shake?: boolean
}

export function EmailPhoneField({
  value,
  onChange,
  onBlur,
  error,
  shake = false,
}: EmailPhoneFieldProps) {
  const id = useId()

  return (
    <div className={shake ? 'shake' : ''}>
      <label htmlFor={id} className="mb-1.5 block text-sm text-muted">
        Email/Phone number
      </label>
      <input
        id={id}
        type="text"
        name="identifier"
        autoComplete="username"
        placeholder="Email/Phone (without country code)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 w-full rounded-lg border bg-page px-3 text-sm text-text outline-none transition-colors placeholder:text-muted hover:border-input-hover focus:border-accent ${
          error ? 'border-error' : 'border-input-border'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
