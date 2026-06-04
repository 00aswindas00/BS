type BinanceLogoProps = {
  className?: string
  /** header: top nav (matches Buy Crypto height), md: auth cards */
  size?: 'header' | 'md' | 'lg'
}

const SIZE_STYLES = {
  /* ~1.4× nav text-sm line-height; icon + wordmark like Binance.com */
  header: 'h-6 w-auto max-w-[140px]',
  md: 'h-[44px] w-auto max-w-[300px]',
  lg: 'h-[44px] w-auto max-w-[320px]',
} as const

export function BinanceLogo({ className = '', size = 'md' }: BinanceLogoProps) {
  return (
    <img
      src="/logos/Binance-logo.png"
      alt="Binance"
      className={`block shrink-0 object-contain object-left ${SIZE_STYLES[size]} ${className}`}
      draggable={false}
    />
  )
}
