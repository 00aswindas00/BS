import { useState } from 'react'
import { NEWS_ITEMS, TRENDING_TOPICS } from '../../lib/dashboardData'

const SQUARE_TABS = ['News', 'Suggested for You'] as const

export function SquareCard() {
  const [activeTab, setActiveTab] = useState<string>('News')

  return (
    <section className="mt-6 rounded-xl border border-card-border bg-card">
      <div className="border-b border-card-border px-4 pt-4">
        <h2 className="mb-3 text-base font-semibold text-text">Square</h2>
        <div className="flex gap-6">
          {SQUARE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 text-sm transition-colors ${
                activeTab === tab
                  ? 'border-accent font-medium text-text'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg bg-sidebar-active p-4">
          <h3 className="mb-3 text-sm font-semibold text-text">Trending Topics</h3>
          <ol className="space-y-2.5">
            {TRENDING_TOPICS.map((topic, i) => (
              <li key={topic} className="flex gap-2 text-xs">
                <span className="shrink-0 font-medium text-muted">{i + 1}</span>
                <a href="#" className="text-accent transition-colors hover:underline">
                  {topic}
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="min-w-0">
          <ul className="divide-y divide-card-border">
            {NEWS_ITEMS.map((item) => (
              <li key={item.title} className="py-4 first:pt-0 last:pb-0">
                <article>
                  <h4 className="mb-1 text-sm font-medium text-text transition-colors hover:text-accent">
                    <a href="#">{item.title}</a>
                  </h4>
                  <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-muted">
                    {item.excerpt}
                  </p>
                  <time className="text-xs text-muted">{item.time}</time>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
