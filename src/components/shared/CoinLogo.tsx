import { useState } from 'react'
import { PORTFOLIO_ASSETS } from '../../lib/portfolioData'

/** Fallback icon-bg mapping for coins without a known image */
const FALLBACK_BG: Record<string, string> = {}
PORTFOLIO_ASSETS.forEach((a) => {
  FALLBACK_BG[a.symbol] = a.iconBg
})

/**
 * Mapping of symbol → lowercase slug used by coincap.io icon CDN.
 * URL pattern: https://assets.coincap.io/assets/icons/{slug}@2x.png
 */
const COINCAP_SLUGS: Record<string, string> = {
  BTC: 'btc',
  ETH: 'eth',
  USDT: 'usdt',
  TRX: 'trx',
  BNB: 'bnb',
  SOL: 'sol',
  USDC: 'usdc',
  USD1: 'usd1',
}

export function CoinLogo({
  symbol,
  size = 24,
  iconBg,
}: {
  symbol: string
  size?: number
  iconBg?: string
}) {
  const [errored, setErrored] = useState(false)

  const bg = iconBg ?? FALLBACK_BG[symbol] ?? '#627eea'
  const slug = COINCAP_SLUGS[symbol]
  const imgUrl = slug ? `https://assets.coincap.io/assets/icons/${slug}@2x.png` : ''

  if (errored || !imgUrl) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ backgroundColor: bg, width: size, height: size }}
      >
        {symbol.slice(0, 1)}
      </span>
    )
  }

  return (
    <img
      src={imgUrl}
      alt={symbol}
      width={size}
      height={size}
      className="shrink-0 rounded-full"
      onError={() => setErrored(true)}
    />
  )
}
