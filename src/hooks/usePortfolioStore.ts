import { useEffect, useState } from 'react'
import {
  getAccountCoins,
  getAllTransactions,
  getBalances,
  subscribePortfolio,
  initialSync,
  pollPendingTransactions,
  pollAdminUpdates,
} from '../lib/portfolioStore'

export function usePortfolioStore() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    // Fetch once per session — restores from sessionStorage on refresh,
    // hits the DB only on first load after login.
    void initialSync()

    const unsub = subscribePortfolio(() => setTick((v) => v + 1))

    // Fast poll (5 s) — only fires a DB query when there are pending withdrawals
    const pendingTimer = window.setInterval(() => {
      void pollPendingTransactions()
    }, 5_000)

    // Slow poll (30 s) — cheap count check to detect admin deposits or
    // any other server-side change. Only does a full fetch if count differs.
    const adminTimer = window.setInterval(() => {
      void pollAdminUpdates()
    }, 30_000)

    return () => {
      unsub()
      window.clearInterval(pendingTimer)
      window.clearInterval(adminTimer)
    }
  }, [])

  return {
    tick,
    balances: getBalances(),
    coins: getAccountCoins(),
    transactions: getAllTransactions(),
  }
}
