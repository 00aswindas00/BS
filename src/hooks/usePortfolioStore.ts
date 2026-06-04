import { useEffect, useState } from 'react'
import {
  getAccountCoins,
  getAllTransactions,
  getBalances,
  processPendingTransactions,
  subscribePortfolio,
} from '../lib/portfolioStore'

export function usePortfolioStore() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    processPendingTransactions()
    const unsub = subscribePortfolio(() => setTick((v) => v + 1))
    const timer = window.setInterval(() => {
      processPendingTransactions()
      setTick((v) => v + 1)
    }, 10_000)
    return () => {
      unsub()
      window.clearInterval(timer)
    }
  }, [])

  return {
    tick,
    balances: getBalances(),
    coins: getAccountCoins(),
    transactions: getAllTransactions(),
  }
}
