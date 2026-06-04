import { PORTFOLIO_ASSETS, type PortfolioSymbol } from './portfolioData'
import { PENDING_APPROVAL_MS } from './transferConstants'
import {
  buildSeedHistory,
  createWithdrawRecord,
  type TransferRecord,
  type TransferStatus,
} from './transactionHistory'

const BALANCES_KEY = 'bclone_balances'
const TX_KEY = 'bclone_transactions'

type BalanceMap = Record<PortfolioSymbol, number>

type Listener = () => void
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((fn) => fn())
}

export function subscribePortfolio(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function defaultBalances(): BalanceMap {
  return PORTFOLIO_ASSETS.reduce(
    (acc, asset) => {
      acc[asset.symbol] = asset.amount
      return acc
    },
    {} as BalanceMap,
  )
}

export function getBalances(): BalanceMap {
  try {
    const raw = localStorage.getItem(BALANCES_KEY)
    if (!raw) {
      const initial = defaultBalances()
      localStorage.setItem(BALANCES_KEY, JSON.stringify(initial))
      return initial
    }
    return { ...defaultBalances(), ...JSON.parse(raw) } as BalanceMap
  } catch {
    return defaultBalances()
  }
}

export function setBalances(next: BalanceMap) {
  localStorage.setItem(BALANCES_KEY, JSON.stringify(next))
  emit()
}

export function getBalance(symbol: PortfolioSymbol): number {
  return getBalances()[symbol] ?? 0
}

export function adjustBalance(symbol: PortfolioSymbol, delta: number) {
  const balances = getBalances()
  const next = Math.max(0, (balances[symbol] ?? 0) + delta)
  setBalances({ ...balances, [symbol]: next })
}

function loadUserTransactions(): TransferRecord[] {
  try {
    const raw = localStorage.getItem(TX_KEY)
    if (!raw) return []
    return JSON.parse(raw) as TransferRecord[]
  } catch {
    return []
  }
}

function saveUserTransactions(records: TransferRecord[]) {
  localStorage.setItem(TX_KEY, JSON.stringify(records))
}

export function processPendingTransactions(now = new Date()) {
  const user = loadUserTransactions()
  let changed = false

  const updated = user.map((record) => {
    if (record.status !== 'Pending Approval' || !record.pendingUntil) return record
    if (new Date(record.pendingUntil).getTime() > now.getTime()) return record

    changed = true
    return {
      ...record,
      status: 'Completed' as TransferStatus,
      completedAt: now.toISOString(),
      time: formatUtc8(now),
    }
  })

  if (changed) {
    saveUserTransactions(updated)
    emit()
  }
}

export function getAllTransactions(now = new Date()): TransferRecord[] {
  processPendingTransactions(now)
  const seed = buildSeedHistory(now)
  const user = loadUserTransactions()
  const merged = [...user, ...seed]
  return merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function submitWithdraw(params: {
  coin: PortfolioSymbol
  qty: number
  fee: number
  address: string
  networkId: string
}): TransferRecord | null {
  const balances = getBalances()
  const available = balances[params.coin] ?? 0
  const totalDebit = params.qty

  if (totalDebit <= 0 || totalDebit > available) return null

  const now = new Date()
  const pendingUntil = new Date(now.getTime() + PENDING_APPROVAL_MS)
  const record = createWithdrawRecord({
    coin: params.coin,
    qty: params.qty,
    fee: params.fee,
    address: params.address,
    networkId: params.networkId,
    createdAt: now,
    pendingUntil,
  })

  setBalances({ ...balances, [params.coin]: available - totalDebit })

  const user = loadUserTransactions()
  saveUserTransactions([record, ...user])
  emit()

  window.setTimeout(() => processPendingTransactions(), PENDING_APPROVAL_MS + 500)

  return record
}

function formatUtc8(d: Date): string {
  const utc8 = new Date(d.getTime() + 8 * 60 * 60 * 1000)
  const y = utc8.getUTCFullYear()
  const m = String(utc8.getUTCMonth() + 1).padStart(2, '0')
  const day = String(utc8.getUTCDate()).padStart(2, '0')
  const hh = String(utc8.getUTCHours()).padStart(2, '0')
  const mm = String(utc8.getUTCMinutes()).padStart(2, '0')
  const ss = String(utc8.getUTCSeconds()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`
}

export function getAccountCoins() {
  const balances = getBalances()
  return PORTFOLIO_ASSETS.map((asset) => ({
    ...asset,
    amount: balances[asset.symbol] ?? 0,
  })).filter((asset) => asset.amount > 0)
}
