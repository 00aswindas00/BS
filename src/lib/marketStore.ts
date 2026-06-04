import { PORTFOLIO_ASSETS } from './portfolioData'
import { getBalances, subscribePortfolio } from './portfolioStore'

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type BinanceTicker24h = {
  symbol: string
  lastPrice: string
  openPrice: string
  priceChangePercent: string
}

export type MarketAsset = {
  symbol: string
  name: string
  iconBg: string
  amount: number
  usdPrice: number
  openPrice: number
  change24hPercent: number
  usdValue: number
  pnl24hUsd: number
}

export type MarketData = {
  assets: MarketAsset[]
  totalUsd: number
  totalBtc: number
  btcUsdPrice: number
  totalPnl24hUsd: number
  totalPnl24hPercent: number
}

/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */

const BINANCE_SYMBOL_BY_COIN: Record<string, string> = {
  BTC: 'BTCUSDT',
  ETH: 'ETHUSDT',
  TRX: 'TRXUSDT',
}

/** Stablecoin proxy ticker – used to derive a realistic USDT 24 h change */
const USDT_PROXY_SYMBOL = 'FDUSDUSDT'

const BINANCE_SYMBOLS = [...Object.values(BINANCE_SYMBOL_BY_COIN), USDT_PROXY_SYMBOL]

const REFRESH_INTERVAL_MS = 60_000

/* ------------------------------------------------------------------ */
/* Singleton state                                                    */
/* ------------------------------------------------------------------ */

type Listener = () => void
const listeners = new Set<Listener>()

let tickerBySymbol: Record<string, BinanceTicker24h> = {}
let timerId: number | null = null
let portfolioUnsub: (() => void) | null = null
let initialized = false

function emit() {
  listeners.forEach((fn) => fn())
}

/* ------------------------------------------------------------------ */
/* Computed data getter                                               */
/* ------------------------------------------------------------------ */

function computeMarketData(): MarketData {
  const balances = getBalances()

  const assets = PORTFOLIO_ASSETS.map((asset) => {
    const amount = balances[asset.symbol] ?? asset.amount
    const symbol = BINANCE_SYMBOL_BY_COIN[asset.symbol]
    const ticker = symbol ? tickerBySymbol[symbol] : undefined

    let usdPrice: number
    let openPrice: number
    let change24hPercent: number

    if (asset.symbol === 'USDT') {
      usdPrice = 0.9989
      const proxy = tickerBySymbol[USDT_PROXY_SYMBOL]
      change24hPercent = proxy ? Number(proxy.priceChangePercent) : 0
      openPrice = usdPrice / (1 + change24hPercent / 100)
    } else {
      usdPrice = Number(ticker?.lastPrice ?? 0)
      openPrice = Number(ticker?.openPrice ?? 0)
      change24hPercent = Number(ticker?.priceChangePercent ?? 0)
    }

    const usdValue = amount * usdPrice
    const pnl24hUsd = amount * (usdPrice - openPrice)

    return { ...asset, amount, usdPrice, openPrice, change24hPercent, usdValue, pnl24hUsd }
  })

  const totalUsd = assets.reduce((sum, item) => sum + item.usdValue, 0)
  const totalOpenUsd = assets.reduce((sum, item) => sum + item.amount * item.openPrice, 0)
  const totalPnl24hUsd = assets.reduce((sum, item) => sum + item.pnl24hUsd, 0)
  const totalPnl24hPercent = totalOpenUsd > 0 ? (totalPnl24hUsd / totalOpenUsd) * 100 : 0
  const btcUsdPrice = Number(tickerBySymbol.BTCUSDT?.lastPrice ?? 0)
  const totalBtc = btcUsdPrice > 0 ? totalUsd / btcUsdPrice : 0

  return {
    assets,
    totalUsd,
    totalBtc,
    btcUsdPrice,
    totalPnl24hUsd,
    totalPnl24hPercent,
  }
}

/* ------------------------------------------------------------------ */
/* Fetch logic                                                        */
/* ------------------------------------------------------------------ */

async function loadMarketData() {
  try {
    const encoded = encodeURIComponent(JSON.stringify(BINANCE_SYMBOLS))
    const res = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbols=${encoded}`,
    )
    if (!res.ok) return

    const payload = (await res.json()) as BinanceTicker24h[]
    const next: Record<string, BinanceTicker24h> = {}
    payload.forEach((row) => {
      next[row.symbol] = row
    })
    tickerBySymbol = next
    emit()
  } catch {
    // Keep previous values when API is unavailable.
  }
}

/* ------------------------------------------------------------------ */
/* Lifecycle                                                          */
/* ------------------------------------------------------------------ */

function ensureStarted() {
  if (initialized) return
  initialized = true

  // Subscribe to balance changes from portfolioStore
  portfolioUnsub = subscribePortfolio(() => {
    emit()
  })

  // Initial fetch + periodic refresh
  void loadMarketData()
  timerId = window.setInterval(loadMarketData, REFRESH_INTERVAL_MS)
}

function stop() {
  if (!initialized) return
  initialized = false
  if (timerId !== null) {
    window.clearInterval(timerId)
    timerId = null
  }
  if (portfolioUnsub) {
    portfolioUnsub()
    portfolioUnsub = null
  }
}

/* ------------------------------------------------------------------ */
/* Public API                                                         */
/* ------------------------------------------------------------------ */

export function subscribeMarketData(listener: Listener): () => void {
  ensureStarted()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      stop()
    }
  }
}

export function getMarketData(): MarketData {
  ensureStarted()
  return computeMarketData()
}

export function getBtcUsdPrice(): number {
  return Number(tickerBySymbol.BTCUSDT?.lastPrice ?? 0)
}
