import { ChevronRight, Play } from 'lucide-react'

export function DepositFaq() {
  return (
    <aside>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">FAQ</h3>
        <button
          type="button"
          className="flex items-center gap-0.5 text-sm text-muted hover:text-text"
        >
          More
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="mb-4 overflow-hidden rounded-lg border border-card-border bg-card">
        <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-card-border to-page">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
            <Play size={24} className="ml-1 text-accent" fill="currentColor" />
          </div>
        </div>
        <p className="p-3 text-sm text-text">How to deposit crypto? 4:10</p>
      </div>
      <ul className="space-y-3 text-sm text-muted">
        <li>
          <a href="#" className="transition-colors hover:text-accent">
            How to Deposit Crypto Step-by-step Guide
          </a>
        </li>
        <li>
          <a href="#" className="transition-colors hover:text-accent">
            Deposit hasn&apos;t arrived?
          </a>
        </li>
      </ul>
    </aside>
  )
}
