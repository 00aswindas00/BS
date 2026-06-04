import { User } from 'lucide-react'

export function UserProfileHeader() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent">
        <User size={32} className="text-black" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-semibold text-text sm:text-2xl">SUNIL KUMAR</h1>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span>
            UID: <span className="text-text">182758465</span>
          </span>
          <span className="hidden h-3 w-px bg-card-border sm:inline" />
          <span>
            VIP Level: <span className="text-text">Regular User</span>
          </span>
          <span className="hidden h-3 w-px bg-card-border sm:inline" />
          <span>
            Following: <span className="text-text">0</span>
          </span>
          <span className="hidden h-3 w-px bg-card-border sm:inline" />
          <span>
            Followers: <span className="text-text">0</span>
          </span>
        </div>
      </div>
    </div>
  )
}
