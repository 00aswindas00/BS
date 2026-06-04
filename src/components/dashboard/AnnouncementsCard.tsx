import { ChevronRight } from 'lucide-react'

export function AnnouncementsCard() {
  return (
    <section className="flex h-full min-h-[280px] flex-col rounded-xl border border-card-border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-card-border px-4 py-4">
        <h2 className="text-base font-semibold text-text">Announcements</h2>
        <button
          type="button"
          className="flex items-center gap-0.5 text-sm text-muted transition-colors hover:text-accent"
        >
          More
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col justify-between bg-gradient-to-br from-[#1a3a5c] via-[#1e2329] to-[#1e2329] p-5">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#58a6ff]">
            Earn Together
          </p>
          <h3 className="text-lg font-bold leading-tight text-text sm:text-xl">
            Unlock Up to
            <br />
            1,000 USDC
          </h3>
          <p className="mt-2 text-xs text-muted">Invite friends and earn rewards together</p>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rounded-full bg-[#2775ca]/30 blur-xl" />
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#2775ca] shadow-lg" />
              <div className="absolute -right-1 top-2 h-8 w-8 rounded-full bg-accent/90 shadow" />
              <div className="absolute bottom-0 left-0 h-6 w-6 rounded-full bg-[#26a17b]/90 shadow" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          <span className="h-1.5 w-4 rounded-full bg-accent" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
        </div>
      </div>
    </section>
  )
}
