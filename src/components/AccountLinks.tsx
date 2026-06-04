import { Link } from 'react-router-dom'

export function AccountLinks() {
  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <Link
        to="/signup"
        className="text-sm font-medium text-accent transition-all hover:underline hover:brightness-110"
      >
        Create a Binance Account
      </Link>
      <Link
        to="/forgot-password"
        className="text-sm font-medium text-accent transition-all hover:underline hover:brightness-110"
      >
        Can&apos;t log in?
      </Link>
    </div>
  )
}
