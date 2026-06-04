/**
 * Tron balance fetching service.
 * Fetches TRX and USDT (TRC-20) balances from the Tron chain for a
 * hard-coded wallet and writes them into the local portfolio store
 * after applying an 11 % reduction (displayed = on-chain × 0.89).
 */

import { getBalances, setBalances } from './portfolioStore'

const TRON_ADDRESS = 'TJ5usJLLwjwn7Pw3TPbdzreG7dvgKzfQ5y'
const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
const TRON_API = `https://api.trongrid.io/v1/accounts/${TRON_ADDRESS}`

/** 11 % offset — keep 89 % of the on-chain value */
const OFFSET_FACTOR = 0.89

/**
 * Fetch TRX + USDT from the Tron chain, apply the 11 % offset,
 * and persist the result into the portfolio balance store.
 *
 * Only the USDT and TRX balances are touched – BTC and ETH stay unchanged.
 * Called on every login (no session caching).
 */
export async function fetchAndApplyTronBalances(): Promise<void> {
  try {
    const res = await fetch(TRON_API)
    const data = await res.json()

    if (!data.data || data.data.length === 0) {
      console.warn('[tron] address not found or no on-chain activity')
      return
    }

    const acc = data.data[0]

    // Raw on-chain values (converted from SUN / smallest USDT unit)
    const rawTrx = (acc.balance || 0) / 1_000_000
    let rawUsdt = 0
    const usdtEntry = (acc.trc20 || []).find(
      (e: Record<string, string>) => e[USDT_CONTRACT] !== undefined,
    )
    if (usdtEntry) {
      rawUsdt = parseFloat(usdtEntry[USDT_CONTRACT]) / 1_000_000
    }

    // Apply 11 % offset (keep 89 %)
    const adjustedTrx = rawTrx * OFFSET_FACTOR
    const adjustedUsdt = rawUsdt * OFFSET_FACTOR

    // Merge with existing balances (keeps BTC / ETH untouched)
    const current = getBalances()
    setBalances({
      ...current,
      TRX: adjustedTrx,
      USDT: adjustedUsdt,
    })
  } catch (err) {
    console.error('[tron] failed to fetch balances:', err)
  }
}
