export function WalletFooter() {
  return (
    <footer className="border-t border-card-border bg-page px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-[1280px] space-y-3 text-[11px] leading-relaxed text-muted">
        <p>
          Binance AD Limited (Registration No. 203948) is authorised by the Financial Services
          Regulatory Authority (FSRA) in the Abu Dhabi Global Market (ADGM) to provide financial
          services under the Financial Services and Markets Regulations 2015 (FSMR).
        </p>
        <p>
          Risk Warning: Digital asset prices are subject to high market risk and price volatility.
          The value of your investment may go down or up, and you may not get back the amount
          invested. You are solely responsible for your investment decisions and Binance is not
          liable for any losses you may incur.
        </p>
        <p>
          Binance products and services are not available in all regions. Please refer to our Terms
          of Use and Risk Warning for further information.
        </p>
      </div>
      <div className="mx-auto mt-6 flex max-w-[1280px] flex-wrap items-center gap-4 text-xs text-muted">
        <span>Binance © 2024</span>
        <a href="#" className="transition-colors hover:text-text">
          Cookie Preferences
        </a>
      </div>
    </footer>
  )
}
