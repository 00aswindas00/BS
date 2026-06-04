import { useState } from 'react'
import { EmptyTableState } from '../shared/EmptyTableState'

export function PaymentAccountContent() {
  const [tab, setTab] = useState<'p2p' | 'buy'>('p2p')

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-text">Payment</h1>

      <div className="mb-6 flex gap-6 border-b border-card-border">
        {[
          { id: 'p2p' as const, label: 'P2P' },
          { id: 'buy' as const, label: 'Buy Crypto' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 pb-3 text-sm transition-colors ${
              tab === t.id
                ? 'border-accent font-medium text-text'
                : 'border-transparent text-muted hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          P2P payment methods: When you sell cryptocurrencies, the added payment method will be
          shown to the buyer. The account owner&apos;s name must match your verified name. You can
          add up to 20 payment methods.
        </p>
        <button
          type="button"
          className="h-9 shrink-0 rounded-md bg-accent px-4 text-sm font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          + Add a payment method
        </button>
      </div>

      <div className="rounded-xl border border-card-border bg-card">
        <EmptyTableState message="You have not added any payment methods" />
      </div>
    </div>
  )
}
