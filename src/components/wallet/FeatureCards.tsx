import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FEATURE_CARDS } from '../../lib/walletData'

function ConvertGraphic() {
  return (
    <div className="relative h-20 w-20 shrink-0">
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/40" />
      <div className="absolute inset-2 flex items-center justify-center rounded-full bg-accent/20">
        <div className="h-8 w-8 rounded-full bg-accent shadow-lg" />
      </div>
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 80 80">
        <path
          d="M40 8 A32 32 0 1 1 20 60"
          fill="none"
          stroke="#fcd535"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M40 72 A32 32 0 1 1 60 20"
          fill="none"
          stroke="#fcd535"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function SpotGraphic() {
  return (
    <div className="relative h-20 w-20 shrink-0">
      <div className="absolute right-0 top-0 h-10 w-10 rotate-12 rounded bg-card-border/80" />
      <div className="absolute bottom-2 left-2 h-12 w-12 rounded-lg bg-card-border" />
      <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg">
        <span className="text-xs font-bold text-black">₿</span>
      </div>
    </div>
  )
}

export function FeatureCards() {
  return (
    <section className="relative mb-6">
      <div className="grid gap-4 md:grid-cols-2">
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-card-border bg-card p-5"
          >
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-medium leading-snug text-text">{card.title}</p>
              {card.variant === 'spot' && card.subtitle && (
                <p className="mb-2 text-xs text-muted">
                  {card.subtitle}{' '}
                  <span className="text-error">{card.change}</span>
                </p>
              )}
              <button
                type="button"
                className="text-sm font-medium text-accent transition-colors hover:underline"
              >
                {card.link}
              </button>
            </div>
            {card.variant === 'convert' ? <ConvertGraphic /> : <SpotGraphic />}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="absolute -left-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-card-border bg-card text-muted shadow transition-colors hover:text-text md:flex"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        className="absolute -right-3 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-card-border bg-card text-muted shadow transition-colors hover:text-text md:flex"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </section>
  )
}
