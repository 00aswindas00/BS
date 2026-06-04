import { Globe, Moon } from 'lucide-react'
import { FOOTER_LINKS } from '../../../lib/dashboardData'

const SOCIAL_ICONS = ['X', 'TG', 'FB', 'IG', 'DC', 'RD']

export function DashboardFooter() {
  return (
    <footer className="border-t border-card-border bg-page px-3 py-6 sm:px-6 sm:py-10 lg:px-10">
      <div className="mb-10 flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {SOCIAL_ICONS.map((s) => (
            <button
              key={s}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-card-border text-[10px] font-medium text-muted transition-colors hover:border-input-border hover:text-text"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <button
            type="button"
            className="flex items-center gap-1.5 transition-colors hover:text-text"
          >
            <Globe size={14} />
            English
          </button>
          <button type="button" className="transition-colors hover:text-text">
            USD-$
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 transition-colors hover:text-text"
            aria-label="Theme"
          >
            <Moon size={14} />
          </button>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h3 className="mb-3 text-sm font-semibold text-text">{title}</h3>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs text-muted transition-colors hover:text-text"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-6 space-y-3 text-[11px] leading-relaxed text-muted">
        <p>
          Binance AD Limited (Registration No. 203948) is authorised by the Financial Services
          Regulatory Authority (FSRA) in the Abu Dhabi Global Market (ADGM) to provide financial
          services under the Financial Services and Markets Regulations 2015 (FSMR).
        </p>
        <p>
          Risk Warning: Digital asset prices can be volatile. The value of your investment may go
          down or up and you may not get back the amount invested. You are solely responsible for
          your investment decisions and Binance is not liable for any losses you may incur.
        </p>
        <p>
          Please note that our Terms of Use, Privacy Policy, and other policies may be updated
          from time to time. We recommend that you review these documents periodically.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted">
        <span>Binance © 2024</span>
        <a href="#" className="transition-colors hover:text-text">
          Cookie Preferences
        </a>
      </div>
    </footer>
  )
}
