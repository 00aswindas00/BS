import { useEffect, useState } from 'react'
import { subscribeMarketData, getMarketData } from '../lib/marketStore'

export function usePortfolioMarketData() {
  const [data, setData] = useState(() => getMarketData())

  useEffect(() => {
    return subscribeMarketData(() => setData(getMarketData()))
  }, [])

  return data
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount)
}

/** Format a per-unit price with 4 decimal places (for USDT, etc.) */
export function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(amount)
}

export function formatCoinAmount(amount: number, symbol: string) {
  const digits = symbol === 'USDT' ? 6 : 6
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  })
}

export function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}
