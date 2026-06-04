import { useState } from 'react'
import { X } from 'lucide-react'

export function NotificationBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center bg-card px-4 py-2.5 text-center text-xs leading-relaxed text-text sm:px-10">
      <p className="max-w-5xl">
        We are currently reviewing our product and service offerings in line with evolving
        regulatory requirements. Some products and services may not be available in certain
        jurisdictions.{' '}
        <a href="#start" className="font-medium text-accent hover:underline">
          Start Now
        </a>
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-4 flex h-6 w-6 items-center justify-center rounded text-muted transition-colors hover:text-text"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}
