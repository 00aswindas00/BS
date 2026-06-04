import { ChevronRight } from 'lucide-react'

const LINKS = [
  'How to withdraw crypto? (Video)',
  'How to Find My Transaction ID (TxID)?',
  'How to Recover My BEP-20 Tokens?',
  'Deposit & Withdrawal Status query',
]

export function WithdrawFaq() {
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
      <ul className="space-y-4 text-sm text-text">
        {LINKS.map((link) => (
          <li key={link}>
            <a href="#" className="transition-colors hover:text-accent">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
