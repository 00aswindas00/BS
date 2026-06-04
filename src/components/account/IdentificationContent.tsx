import { CheckCircle2, XCircle, Headphones } from 'lucide-react'

export function IdentificationContent() {
  return (
    <div className="relative pb-16">
      <h1 className="mb-6 text-2xl font-semibold text-text">Identification</h1>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sidebar-active text-2xl">
            🏆
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-card text-[10px]">
            🇮🇳
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text">SUNIL KUMAR</h2>
          <p className="text-sm text-muted">ID: 182758465</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-success">
            <CheckCircle2 size={16} />
            Verified
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-t-2 border-t-accent border-card-border bg-card p-5">
        <h3 className="mb-2 font-semibold text-text">Action Required</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted">
          To meet our new regulatory requirements, we need you to complete an additional verification
          step. This process will take only 2 minutes of your time.
        </p>
        <button
          type="button"
          className="h-10 rounded-md bg-accent px-6 text-sm font-semibold text-black transition-colors hover:bg-accent-hover"
        >
          Verify Now
        </button>
      </div>

      <div className="mb-8 rounded-lg bg-[#1a2332] p-5">
        <p className="mb-3 text-sm font-medium text-text">
          We could not upgrade your verification to Verified Plus.
        </p>
        <p className="mb-3 flex items-center gap-2 text-sm text-error">
          <XCircle size={16} />
          (POA) Unclear copy
        </p>
        <a href="#" className="mb-4 inline-block text-sm text-accent underline hover:brightness-110">
          Proof of Address FAQ &amp; Acceptable Documents
        </a>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="h-9 rounded-md border border-input-border bg-sidebar-active px-5 text-sm font-medium text-text transition-colors hover:border-input-hover"
          >
            Try Again
          </button>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-text"
          >
            <Headphones size={16} />
            Need help?
          </a>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="mb-4 text-lg font-semibold text-text">Account Limits</h3>
        <ul className="space-y-3 text-sm">
          {[
            ['Fiat Deposit & Withdrawal Limits', '50K USD Daily'],
            ['Crypto Deposit Limit', 'Unlimited'],
            ['Crypto Withdrawal Limit', '8M USDT Daily'],
            ['P2P Transaction Limits', 'Unlimited'],
          ].map(([label, value]) => (
            <li key={label} className="flex justify-between gap-4 border-b border-card-border pb-3">
              <span className="text-muted">{label}</span>
              <span className="font-medium text-text">{value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">Personal information</h3>
          <button type="button" className="text-sm font-medium text-accent hover:underline">
            Update Identity
          </button>
        </div>
        <dl className="space-y-4 text-sm">
          <div className="flex justify-between gap-4 border-b border-card-border pb-3">
            <dt className="text-muted">Country of Residence</dt>
            <dd className="text-right text-text">
              India{' '}
              <button type="button" className="ml-2 text-accent hover:underline">
                Change
              </button>
            </dd>
          </div>
          <InfoRow label="Legal Name" value="SUNIL KUMAR" />
          <InfoRow label="Date of Birth" value="1990-01-01" />
          <InfoRow label="Identification Documents" value="Aadhaar card" />
          <InfoRow
            label="Address"
            value="123 Example Street, City, State, India"
          />
          <InfoRow label="Email Address" value="sunilkryptousdt@gmail.com" />
        </dl>
      </section>

      <div className="rounded-lg border border-card-border bg-card p-4 text-sm leading-relaxed text-muted">
        If you need to correct your name or date of birth, please submit a{' '}
        <a href="#" className="text-accent underline">
          Name Correction Appeal
        </a>{' '}
        or{' '}
        <a href="#" className="text-accent underline">
          Date of Birth Correction Appeal
        </a>
        .
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-lg transition-transform hover:scale-105"
        aria-label="Support"
      >
        <Headphones size={22} className="text-black" />
      </button>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-card-border pb-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-text">{value}</dd>
    </div>
  )
}
